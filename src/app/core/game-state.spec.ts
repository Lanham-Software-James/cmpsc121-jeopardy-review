import { describe, expect, it } from 'vitest';
import { GameState } from './game-state';
import { MIDTERM_ONE_CATEGORIES } from '../exams/midterm-one/midterm-one.questions';

const create = () => new GameState({ id: 'midterm-1', title: 'Midterm 1', subject: 'C++', description: '', categories: MIDTERM_ONE_CATEGORIES });

describe('classroom review game', () => {
  it('preserves all 30 complete practice clues', () => {
    const game = create();
    expect(game.total).toBe(30);
    expect(game.exam.categories).toHaveLength(6);
    for (const category of game.exam.categories) {
      expect(category.clues).toHaveLength(5);
      for (const clue of category.clues) { expect(clue.q).toBeTruthy(); expect(clue.a).toBeTruthy(); expect(clue.why).toBeTruthy(); }
    }
  });
  it('deducts incorrect answers, allows another team, and undoes completion in order', () => {
    const game = create(); game.open(0, 2); game.score(0, false);
    expect(game.teams[0].score).toBe(-300); expect(game.current).not.toBeNull(); expect(game.played.size).toBe(0);
    game.score(1, true); expect(game.teams[1].score).toBe(300); expect(game.current).toBeNull(); expect(game.played.has('0-2')).toBe(true);
    game.undo(); expect(game.teams[1].score).toBe(0); expect(game.played.size).toBe(0); expect(game.teams[0].score).toBe(-300);
    game.undo(); expect(game.teams[0].score).toBe(0); expect(game.history).toHaveLength(0);
  });
  it('closing retains deductions and leaves the clue playable', () => {
    const game = create(); game.open(1, 0); game.score(0, false); game.close(); game.open(1, 0);
    expect(game.current?.key).toBe('1-0'); expect(game.teams[0].score).toBe(-100);
  });
  it('finishes unanswered clues without inventing a score and blocks replays', () => {
    const game = create(); game.open(2, 4); game.finish(); game.open(2, 4);
    expect(game.current).toBeNull(); expect(game.history).toHaveLength(0); expect(game.played.size).toBe(1);
  });
  it('caps teams at six and normalizes names', () => {
    const game = create(); game.addTeam(); game.addTeam(); game.addTeam(); expect(game.teams).toHaveLength(6);
    game.renameTeam(0, '   '); expect(game.teams[0].name).toBe('Team 1');
    game.renameTeam(0, '  Debuggers  '); expect(game.teams[0].name).toBe('Debuggers');
  });
  it('resets scores and clues while retaining team names', () => {
    const game = create(); game.renameTeam(0, 'Debuggers'); game.open(0, 0); game.score(0, true); game.open(0, 1); game.reset();
    expect(game.teams[0]).toEqual({ name: 'Debuggers', score: 0 }); expect(game.current).toBeNull(); expect(game.played.size).toBe(0); expect(game.history).toHaveLength(0);
  });
  it('removes the last team while keeping at least one team', () => {
    const game = create();
    game.removeTeam();
    expect(game.teams.map(t => t.name)).toEqual(['Team 1', 'Team 2', 'Team 3']);
    for (let i = 0; i < 5; i++) game.removeTeam();
    expect(game.teams).toEqual([{ name: 'Team 1', score: 0 }]);
  });
  it('keeps completed clues and remaining undo history when removing a scored team', () => {
    const game = create();
    game.open(0, 0); game.score(0, true);
    game.open(0, 1); game.score(3, false); game.score(3, true);
    game.removeTeam(); game.addTeam();
    expect(game.played.has('0-1')).toBe(true);
    game.undo();
    expect(game.teams[0].score).toBe(0);
    expect(game.teams[3].score).toBe(0);
    expect(game.played.has('0-0')).toBe(false);
    expect(game.played.has('0-1')).toBe(true);
    expect(() => game.undo()).not.toThrow();
  });
  it('announces shared winners and updates after undo', () => {
    const game = create();
    for (let c = 0; c < 6; c++) for (let row = 0; row < 5; row++) { game.open(c, row); game.score(c % 2, true); }
    expect(game.complete).toBe(true); expect(game.announcement).toContain('Team 1 & Team 2 tie with 4500 points');
    game.undo(); expect(game.complete).toBe(false); expect(game.announcement).toContain('Undid');
  });
  it('keeps exam instances independent and ignores invalid selections', () => {
    const first = create(), second = create(); first.open(0, 0); first.score(0, true);
    expect(second.teams[0].score).toBe(0); expect(second.played.size).toBe(0);
    second.open(9, 9); expect(second.current).toBeNull(); second.score(100, true); second.undo();
  });
});
