import { Component } from '@angular/core';
import { ExamReview } from '../../core/exam.model';
import { GameComponent } from '../../shared/game/game.component';
import { MIDTERM_ONE_CATEGORIES } from './midterm-one.questions';

@Component({ selector: 'app-midterm-one', imports: [GameComponent], template: '<app-game [exam]="exam" />' })
export class MidtermOneComponent {
  readonly exam: ExamReview = {
    id: 'midterm-1', title: 'Midterm 1', subject: 'C++ fundamentals',
    description: 'From your first variable to your next loop. Put your C++ knowledge to the test, one clue at a time.',
    categories: MIDTERM_ONE_CATEGORIES
  };
}
