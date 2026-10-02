export interface Clue { q: string; code?: string; a: string; why: string; }
export interface Category { name: string; clues: readonly Clue[]; }
export interface ExamReview {
  id: string;
  title: string;
  subject: string;
  description: string;
  categories: readonly Category[];
}
export interface Team { name: string; score: number; }
export interface ClueSelection { category: number; row: number; key: string; value: number; }
export interface ScoreAction { teamIndex: number; delta: number; key: string; completed: boolean; }
