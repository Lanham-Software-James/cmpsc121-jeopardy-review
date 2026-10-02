import { ClueSelection, ExamReview, ScoreAction, Team } from './exam.model';

/** Independent game state: one instance per exam component, no shared global scores. */
export class GameState {
  teams: Team[] = Array.from({ length: 4 }, (_, i) => ({ name: `Team ${i + 1}`, score: 0 }));
  played = new Set<string>();
  history: ScoreAction[] = [];
  current: ClueSelection | null = null;
  status = 'Choose a clue to begin. The instructor judges each response.';
  clueStatus = '';
  constructor(readonly exam: ExamReview) {}

  get total(): number { return this.exam.categories.reduce((n, c) => n + c.clues.length, 0); }
  get complete(): boolean { return this.played.size === this.total; }
  get announcement(): string {
    if (!this.complete) return this.status;
    const high = Math.max(...this.teams.map(t => t.score));
    const winners = this.teams.filter(t => t.score === high).map(t => t.name);
    return `Board complete! ${winners.join(' & ')} ${winners.length === 1 ? 'wins' : 'tie'} with ${high} points.`;
  }
  open(category: number, row: number): void {
    const key = `${category}-${row}`;
    if (this.current || this.played.has(key) || !this.exam.categories[category]?.clues[row]) return;
    this.current = { category, row, key, value: (row + 1) * 100 };
    this.clueStatus = '';
  }
  close(): void { this.current = null; }
  finish(): void {
    if (!this.current) return;
    this.played.add(this.current.key);
    this.status = 'Clue completed. Choose your next challenge.';
    this.close();
  }
  score(teamIndex: number, correct: boolean): void {
    if (!this.current || !this.teams[teamIndex]) return;
    const delta = this.current.value * (correct ? 1 : -1);
    this.history.push({ teamIndex, delta, key: this.current.key, completed: correct });
    this.teams[teamIndex].score += delta;
    if (correct) this.finish();
    else this.clueStatus = `${this.teams[teamIndex].name}: −${this.current.value}. Another team may try.`;
    this.status = `${this.teams[teamIndex].name}: ${delta > 0 ? '+' : ''}${delta} points.`;
  }
  undo(): void {
    const action = this.history.pop();
    if (!action) return;
    this.teams[action.teamIndex].score -= action.delta;
    if (action.completed) this.played.delete(action.key);
    this.status = `Undid ${action.delta > 0 ? '+' : ''}${action.delta} points for ${this.teams[action.teamIndex].name}.`;
  }
  addTeam(): void {
    if (this.teams.length < 6) this.teams.push({ name: `Team ${this.teams.length + 1}`, score: 0 });
  }
  removeTeam(): void {
    if (this.teams.length <= 1) return;
    const removed = this.teams.pop()!;
    // Keep completed clues, but never apply a removed team's undo to a new team.
    this.history = this.history.filter(action => action.teamIndex < this.teams.length);
    this.status = `Removed ${removed.name}.`;
    this.clueStatus = '';
  }
  renameTeam(index: number, name: string): void {
    if (this.teams[index]) this.teams[index].name = name.trim().slice(0, 30) || `Team ${index + 1}`;
  }
  reset(): void {
    this.close(); this.played.clear(); this.history = [];
    this.teams.forEach(t => t.score = 0);
    this.status = 'New game. Choose a clue to begin.';
    this.clueStatus = '';
  }
}
