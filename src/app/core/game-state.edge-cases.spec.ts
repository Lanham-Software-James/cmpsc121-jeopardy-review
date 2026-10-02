import { describe, expect, it } from 'vitest';
import { ExamReview } from './exam.model';
import { GameState } from './game-state';

// Uneven categories exercise the reusable game independently of Midterm 1.
const exam: ExamReview = {
  id: 'test', title: 'Practice', subject: 'Testing', description: '',
  categories: [
    { name: 'Short', clues: [{ q: 'One?', a: 'One', why: 'First clue' }] },
    { name: 'Long', clues: [
      { q: 'Two?', a: 'Two', why: 'Second clue' },
      { q: 'Three?', a: 'Three', why: 'Third clue' },
    ] },
  ],
};
const create = () => new GameState(exam);

function finishBoard(game: GameState): void {
  game.exam.categories.forEach((category, c) => {
    category.clues.forEach((_, row) => { game.open(c, row); game.finish(); });
  });
}

describe('clue selection and scoring safeguards', () => {
  it('counts actual clues in uneven categories and completes only after all are played', () => {
    const game = create();
    expect(game.total).toBe(3);
    game.open(0, 0); game.finish();
    expect(game.complete).toBe(false);
    finishBoard(game);
    expect(game.complete).toBe(true);
    expect(game.played.size).toBe(3);
  });

  it.each([[-1, 0], [0, -1], [2, 0], [0, 1], [1, 2]])(
    'ignores nonexistent clue (%i, %i)', (category, row) => {
      const game = create();
      game.open(category, row);
      expect(game.current).toBeNull();
      expect(game.played.size).toBe(0);
      expect(game.history).toEqual([]);
    },
  );

  it('does not replace an active clue with another selection', () => {
    const game = create();
    game.open(1, 1);
    game.open(0, 0);
    expect(game.current).toEqual({ category: 1, row: 1, key: '1-1', value: 200 });
    game.score(0, true);
    expect(game.teams[0].score).toBe(200);
    expect([...game.played]).toEqual(['1-1']);
  });

  it.each([-1, 4, 99])('ignores invalid responding team %i while a clue is open', team => {
    const game = create();
    game.open(0, 0);
    const selection = game.current;
    const status = game.status;
    game.score(team, true);
    game.score(team, false);
    expect(game.current).toBe(selection);
    expect(game.teams.map(t => t.score)).toEqual([0, 0, 0, 0]);
    expect(game.history).toEqual([]);
    expect(game.played.size).toBe(0);
    expect(game.status).toBe(status);
  });

  it('ignores scoring and finishing without an open clue, including repeated correct clicks', () => {
    const game = create();
    game.score(0, false); game.finish();
    expect(game.history).toEqual([]);
    expect(game.played.size).toBe(0);
    game.open(0, 0); game.score(0, true);
    game.score(0, true); game.score(1, false); game.finish();
    expect(game.teams.map(t => t.score)).toEqual([100, 0, 0, 0]);
    expect(game.history).toHaveLength(1);
    expect([...game.played]).toEqual(['0-0']);
  });

  it('clears the previous incorrect-response message when a new clue opens', () => {
    const game = create();
    game.open(0, 0); game.score(0, false);
    expect(game.clueStatus).toContain('Team 1');
    game.close(); game.open(1, 0);
    expect(game.clueStatus).toBe('');
  });
});

describe('undo and team lifecycle', () => {
  it('undoes multiple incorrect responses in reverse order without closing the clue', () => {
    const game = create();
    game.open(1, 1);
    game.score(0, false); game.score(1, false); game.score(0, false);
    expect(game.teams.map(t => t.score)).toEqual([-400, -200, 0, 0]);
    game.undo();
    expect(game.teams.map(t => t.score)).toEqual([-200, -200, 0, 0]);
    game.undo(); game.undo(); game.undo();
    expect(game.teams.map(t => t.score)).toEqual([0, 0, 0, 0]);
    expect(game.current?.key).toBe('1-1');
    expect(game.played.size).toBe(0);
  });

  it('keeps a manually finished clue completed when undoing its earlier penalty', () => {
    const game = create();
    game.open(0, 0); game.score(0, false); game.finish(); game.undo();
    expect(game.teams[0].score).toBe(0);
    expect(game.played.has('0-0')).toBe(true);
    expect(game.current).toBeNull();
  });

  it('preserves other teams and their interleaved undo history after removal', () => {
    const game = create();
    game.open(1, 1);
    game.score(0, false); game.score(3, false); game.score(1, false);
    game.removeTeam();
    expect(game.teams.map(t => t.score)).toEqual([-200, -200, 0]);
    expect(game.current?.key).toBe('1-1');
    expect(game.clueStatus).toBe('');
    expect(game.status).toBe('Removed Team 4.');
    game.undo();
    expect(game.teams.map(t => t.score)).toEqual([-200, 0, 0]);
    game.undo();
    expect(game.teams.map(t => t.score)).toEqual([0, 0, 0]);
    expect(game.history).toEqual([]);
  });

  it('cannot remove the last team or lose its score and undo history', () => {
    const game = create();
    while (game.teams.length > 1) game.removeTeam();
    game.open(0, 0); game.score(0, true);
    game.removeTeam();
    expect(game.teams).toEqual([{ name: 'Team 1', score: 100 }]);
    expect(game.history).toHaveLength(1);
    game.undo();
    expect(game.teams[0].score).toBe(0);
    expect(game.played.size).toBe(0);
  });

  it('trims and limits names and ignores invalid rename targets', () => {
    const game = create();
    game.renameTeam(0, `  ${'a'.repeat(40)}  `);
    expect(game.teams[0].name).toBe('a'.repeat(30));
    game.renameTeam(2, '\t\n');
    expect(game.teams[2].name).toBe('Team 3');
    const before = game.teams.map(t => ({ ...t }));
    game.renameTeam(-1, 'Invalid'); game.renameTeam(4, 'Invalid');
    expect(game.teams).toEqual(before);
  });

  it('resets all scores and transient state while preserving the chosen team roster', () => {
    const game = create();
    game.removeTeam(); game.renameTeam(1, 'Debuggers');
    game.open(0, 0); game.score(0, true);
    game.open(1, 1); game.score(1, false);
    game.reset();
    expect(game.teams).toEqual([
      { name: 'Team 1', score: 0 }, { name: 'Debuggers', score: 0 }, { name: 'Team 3', score: 0 },
    ]);
    expect(game.current).toBeNull();
    expect(game.history).toEqual([]);
    expect(game.played.size).toBe(0);
    expect(game.clueStatus).toBe('');
    expect(game.complete).toBe(false);
    expect(game.announcement).toBe('New game. Choose a clue to begin.');
    game.undo();
    expect(game.teams.every(t => t.score === 0)).toBe(true);
  });
});

describe('winner announcements', () => {
  it('announces a single winner using the current team name', () => {
    const game = create();
    game.open(1, 1); game.score(1, true); finishBoard(game);
    game.renameTeam(1, 'Debuggers');
    expect(game.announcement).toBe('Board complete! Debuggers wins with 200 points.');
  });

  it('chooses the highest score even when every score is negative', () => {
    const game = create();
    game.open(0, 0);
    for (let team = 0; team < 4; team++) game.score(team, false);
    game.score(0, false); game.score(2, false); game.score(3, false);
    game.finish(); finishBoard(game);
    expect(game.announcement).toBe('Board complete! Team 2 wins with -100 points.');
  });

  it('announces a zero-point tie when all clues are finished without scoring', () => {
    const game = create();
    finishBoard(game);
    expect(game.announcement).toBe('Board complete! Team 1 & Team 2 & Team 3 & Team 4 tie with 0 points.');
  });

  it('recalculates the winner after removing the winning team', () => {
    const game = create();
    game.open(0, 0); game.score(0, true);
    game.open(1, 1); game.score(3, true); finishBoard(game);
    expect(game.announcement).toBe('Board complete! Team 4 wins with 200 points.');
    game.removeTeam();
    expect(game.complete).toBe(true);
    expect(game.announcement).toBe('Board complete! Team 1 wins with 100 points.');
  });
});
