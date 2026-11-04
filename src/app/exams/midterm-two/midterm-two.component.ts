import { Component } from '@angular/core';
import { ExamReview } from '../../core/exam.model';
import { GameComponent } from '../../shared/game/game.component';
import { MIDTERM_TWO_CATEGORIES } from './midterm-two.questions';

@Component({ selector: 'app-midterm-two', imports: [GameComponent], template: '<app-game [exam]="exam" />' })
export class MidtermTwoComponent {
  readonly exam: ExamReview = {
    id: 'midterm-2', title: 'Midterm 2', subject: 'Functions, arrays & pointers',
    description: 'From reusable functions to dynamic memory. Trace, explain, and debug your C++ knowledge, one clue at a time.',
    categories: MIDTERM_TWO_CATEGORIES
  };
}
