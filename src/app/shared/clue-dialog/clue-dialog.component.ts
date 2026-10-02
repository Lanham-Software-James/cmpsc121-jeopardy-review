import { AfterViewInit, Component, ElementRef, OnDestroy, input, output, signal, viewChild } from '@angular/core';
import { Clue, Team } from '../../core/exam.model';

@Component({
  selector: 'app-clue-dialog',
  template: `
    <dialog #dialog aria-labelledby="clue-question" (cancel)="$event.preventDefault(); close()">
      <div class="modal-top"><span class="eyebrow">{{ category() }} <span class="dot-divider">/</span> {{ value() }} points</span>
        <button class="icon-button" aria-label="Return to board" (click)="close()">×</button></div>
      <h2 id="clue-question" class="clue-question">{{ clue().q }}</h2>
      @if (clue().code) { <pre><code>{{ clue().code }}</code></pre> }
      <div class="timer-row"><button class="text-button" (click)="toggleTimer()">{{ running() ? 'Ⅱ Pause timer' : seconds() === 0 ? '↻ Restart timer' : '▷ Resume timer' }}</button>
        <span class="countdown" [class.expired]="seconds() === 0" role="timer" aria-label="Time remaining">0:{{ seconds().toString().padStart(2, '0') }}</span></div>
      @if (seconds() === 0) { <p role="status" class="timer-status">Time is up! The instructor may accept an answer or reveal the solution.</p> }
      @if (!revealed()) { <button class="primary" (click)="reveal()">Reveal answer <span aria-hidden="true">↓</span></button> }
      @else { <section class="answer-area" aria-label="Answer"><h3 class="eyebrow">The answer</h3><p class="answer">{{ clue().a }}</p><p>{{ clue().why }}</p></section> }
      <section class="judging">
        <fieldset class="team-picker">
          <legend>Responding team</legend>
          <div class="team-options" [style.--team-columns]="teams().length > 4 ? 3 : teams().length">
            @for (team of teams(); track $index; let i = $index) {
              <label class="team-option" [class.selected]="selectedTeam === i">
                <input type="radio" name="responding-team" [value]="i" [checked]="selectedTeam === i"
                  (change)="selectedTeam = i">
                <span class="team-option-name">{{ team.name }}</span>
                <span class="team-option-check" aria-hidden="true">{{ selectedTeam === i ? '✓' : '' }}</span>
              </label>
            }
          </div>
        </fieldset>
        <div class="judge-buttons"><button class="positive" (click)="judge(true)">✓ Correct <span>+{{ value() }}</span></button>
          <button (click)="judge(false)">− Incorrect <span>−{{ value() }}</span></button>
          <button class="text-button" (click)="finish()">No answer / finish clue</button></div>
        <p class="clue-status" role="status">{{ status() }}</p>
      </section>
    </dialog>
  `
})
export class ClueDialogComponent implements AfterViewInit, OnDestroy {
  clue = input.required<Clue>();
  category = input.required<string>();
  value = input.required<number>();
  teams = input.required<readonly Team[]>();
  status = input('');
  closed = output<void>();
  finished = output<void>();
  scored = output<{ teamIndex: number; correct: boolean }>();
  dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');
  selectedTeam = 0;
  seconds = signal(30);
  running = signal(false);
  revealed = signal(false);
  private interval: ReturnType<typeof setInterval> | undefined;

  ngAfterViewInit(): void { this.dialog().nativeElement.showModal(); this.startTimer(); }
  ngOnDestroy(): void { this.stopTimer(); }
  private startTimer(): void {
    if (this.running()) return;
    if (this.seconds() === 0) this.seconds.set(30);
    this.running.set(true);
    this.interval = setInterval(() => {
      this.seconds.update(value => Math.max(0, value - 1));
      if (this.seconds() === 0) this.stopTimer();
    }, 1000);
  }
  private stopTimer(): void { clearInterval(this.interval); this.interval = undefined; this.running.set(false); }
  toggleTimer(): void { if (this.running()) this.stopTimer(); else this.startTimer(); }
  reveal(): void { this.stopTimer(); this.revealed.set(true); }
  close(): void { this.stopTimer(); this.dialog().nativeElement.close(); this.closed.emit(); }
  finish(): void { this.stopTimer(); this.dialog().nativeElement.close(); this.finished.emit(); }
  judge(correct: boolean): void {
    if (correct) { this.stopTimer(); this.dialog().nativeElement.close(); }
    this.scored.emit({ teamIndex: this.selectedTeam, correct });
  }
}
