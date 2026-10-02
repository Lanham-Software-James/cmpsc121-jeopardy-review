import { Component, input, output } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Team } from '../../core/exam.model';

@Component({
  selector: 'app-scoreboard', imports: [DecimalPipe],
  template: `
    <div class="section-heading score-heading"><div><h2>The scoreboard</h2><p>A little teamwork. A little friendly competition.</p></div>
      <button class="text-button" [disabled]="teams().length >= 6" (click)="addTeam.emit()">＋ Add team</button>
    </div>
    <section class="teams" aria-label="Team scores">
      @for (team of teams(); track $index; let i = $index) {
        <div class="team" [style.--team-color]="colors[i]">
          <div class="team-top"><span class="team-dot" aria-hidden="true"></span>
            <input [value]="team.name" maxlength="30" [attr.aria-label]="'Team ' + (i + 1) + ' name'"
              (blur)="rename.emit({index: i, name: $any($event.target).value}); $any($event.target).value = teams()[i].name">
            <span class="edit-hint" aria-hidden="true">✎</span>
          </div>
          <div class="team-score"><output [attr.aria-label]="team.name + ' score'">{{ team.score | number }}</output><span>POINTS</span></div>
        </div>
      }
    </section>
  `
})
export class ScoreboardComponent {
  teams = input.required<readonly Team[]>();
  addTeam = output<void>();
  rename = output<{ index: number; name: string }>();
  readonly colors = ['#1e407c', '#3b806f', '#8a6496', '#bc7540', '#527f9a', '#a74c66'];
}
