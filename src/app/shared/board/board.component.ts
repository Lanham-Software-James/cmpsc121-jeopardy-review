import { Component, computed, input, output } from '@angular/core';
import { Category } from '../../core/exam.model';

@Component({
  selector: 'app-board',
  template: `
    <div class="board-scroll" role="region" aria-label="Jeopardy question board" tabindex="0">
      <div class="board" [style.--category-count]="categories().length">
        @for (category of categories(); track $index; let c = $index) {
          <div class="category"><span class="category-number">0{{ c + 1 }}</span><h3>{{ category.name }}</h3></div>
        }
        @for (row of rows(); track row) {
          @for (category of categories(); track $index; let c = $index) {
            @if (category.clues[row]) {
              <button class="tile" [class.played]="played().has(c + '-' + row)"
                [disabled]="played().has(c + '-' + row)"
                [attr.aria-label]="category.name + ', ' + ((row + 1) * 100) + ' points' + (played().has(c + '-' + row) ? ', played' : '')"
                (click)="clueSelected.emit({category: c, row})">
                @if (played().has(c + '-' + row)) { <span aria-hidden="true">✓</span> }
                @else { {{ (row + 1) * 100 }} }
              </button>
            } @else { <div class="tile empty"></div> }
          }
        }
      </div>
    </div>
  `
})
export class BoardComponent {
  categories = input.required<readonly Category[]>();
  played = input.required<ReadonlySet<string>>();
  clueSelected = output<{ category: number; row: number }>();
  rows = computed(() => Array.from({ length: Math.max(0, ...this.categories().map(c => c.clues.length)) }, (_, i) => i));
}
