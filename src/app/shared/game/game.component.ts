import { ChangeDetectorRef, Component, HostListener, OnInit, inject, input } from '@angular/core';
import { ExamReview } from '../../core/exam.model';
import { GameState } from '../../core/game-state';
import { BoardComponent } from '../board/board.component';
import { ScoreboardComponent } from '../scoreboard/scoreboard.component';
import { ClueDialogComponent } from '../clue-dialog/clue-dialog.component';

@Component({
  selector: 'app-game',
  imports: [BoardComponent, ScoreboardComponent, ClueDialogComponent],
  templateUrl: './game.component.html'
})
export class GameComponent implements OnInit {
  exam = input.required<ExamReview>();
  game!: GameState;
  fullscreen = false;
  private readonly changeDetector = inject(ChangeDetectorRef);
  ngOnInit(): void { this.game = new GameState(this.exam()); }
  // New collection identities also notify the standalone presentation components.
  sync(): void { this.game.teams = this.game.teams.map(t => ({ ...t })); this.game.played = new Set(this.game.played); }
  score(event: { teamIndex: number; correct: boolean }): void { this.game.score(event.teamIndex, event.correct); this.sync(); }
  finish(): void { this.game.finish(); this.sync(); }
  undo(): void { this.game.undo(); this.sync(); }
  reset(): void { this.game.reset(); this.sync(); }
  addTeam(): void { this.game.addTeam(); this.sync(); }
  removeTeam(): void { this.game.removeTeam(); this.sync(); }
  renameTeam(event: { index: number; name: string }): void { this.game.renameTeam(event.index, event.name); this.sync(); }
  @HostListener('document:fullscreenchange') onFullscreenChange(): void { this.fullscreen = !!document.fullscreenElement; }
  async toggleFullscreen(): Promise<void> {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
    } catch { this.game.status = 'Full screen is unavailable here. Use your browser’s full-screen command.'; this.changeDetector.markForCheck(); }
  }
}
