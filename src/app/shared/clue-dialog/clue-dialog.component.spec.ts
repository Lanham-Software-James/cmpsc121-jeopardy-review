import '@angular/compiler';
import { createEnvironmentInjector, EnvironmentInjector, runInInjectionContext } from '@angular/core';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ClueDialogComponent } from './clue-dialog.component';

// Exercise component behavior with fake time and a native-dialog stand-in.
// DOM rendering and template bindings are outside this unit suite's scope.
describe('clue dialog timer and judging', () => {
  let injector: EnvironmentInjector;
  let component: ClueDialogComponent;
  let dialog: { showModal: ReturnType<typeof vi.fn<() => void>>; close: ReturnType<typeof vi.fn<() => void>> };
  let scored: ReturnType<typeof vi.fn<(event: { teamIndex: number; correct: boolean }) => void>>;
  let closed: ReturnType<typeof vi.fn<() => void>>;
  let finished: ReturnType<typeof vi.fn<() => void>>;

  beforeEach(() => {
    vi.useFakeTimers();
    injector = createEnvironmentInjector([], null as unknown as EnvironmentInjector);
    component = runInInjectionContext(injector, () => new ClueDialogComponent());
    dialog = { showModal: vi.fn(), close: vi.fn() };
    Object.defineProperty(component, 'dialog', { value: () => ({ nativeElement: dialog }) });
    scored = vi.fn(); closed = vi.fn(); finished = vi.fn();
    component.scored.subscribe(scored);
    component.closed.subscribe(closed);
    component.finished.subscribe(finished);
    component.ngAfterViewInit();
  });

  afterEach(() => {
    component.ngOnDestroy();
    injector.destroy();
    vi.useRealTimers();
  });

  it('opens the dialog and starts a 30-second countdown automatically', () => {
    expect(dialog.showModal).toHaveBeenCalledOnce();
    expect(component.seconds()).toBe(30);
    expect(component.running()).toBe(true);
    vi.advanceTimersByTime(3000);
    expect(component.seconds()).toBe(27);
  });

  it('pauses and resumes without resetting the remaining time or doubling the timer', () => {
    vi.advanceTimersByTime(5000);
    component.toggleTimer();
    vi.advanceTimersByTime(10000);
    expect(component.seconds()).toBe(25);
    expect(component.running()).toBe(false);
    component.toggleTimer();
    vi.advanceTimersByTime(2000);
    expect(component.seconds()).toBe(23);
    expect(vi.getTimerCount()).toBe(1);
  });

  it('stops at zero without scoring, finishing, or closing the clue', () => {
    vi.advanceTimersByTime(60000);
    expect(component.seconds()).toBe(0);
    expect(component.running()).toBe(false);
    expect(vi.getTimerCount()).toBe(0);
    expect(scored).not.toHaveBeenCalled();
    expect(finished).not.toHaveBeenCalled();
    expect(closed).not.toHaveBeenCalled();
    expect(dialog.close).not.toHaveBeenCalled();
  });

  it('restarts an expired timer at 30 seconds', () => {
    vi.advanceTimersByTime(30000);
    component.toggleTimer();
    expect(component.seconds()).toBe(30);
    expect(component.running()).toBe(true);
    vi.advanceTimersByTime(1000);
    expect(component.seconds()).toBe(29);
  });

  it('reveals the answer and freezes time without awarding points', () => {
    vi.advanceTimersByTime(4000);
    component.reveal();
    vi.advanceTimersByTime(30000);
    expect(component.revealed()).toBe(true);
    expect(component.seconds()).toBe(26);
    expect(component.running()).toBe(false);
    expect(scored).not.toHaveBeenCalled();
    expect(dialog.close).not.toHaveBeenCalled();
  });

  it('leaves the clue open and timer running after an incorrect response', () => {
    component.selectedTeam = 2;
    component.judge(false);
    expect(scored).toHaveBeenCalledExactlyOnceWith({ teamIndex: 2, correct: false });
    expect(dialog.close).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1000);
    expect(component.seconds()).toBe(29);
    expect(component.running()).toBe(true);
  });

  it('emits the selected team and stops the timer after a correct response', () => {
    component.selectedTeam = 3;
    component.judge(true);
    expect(scored).toHaveBeenCalledExactlyOnceWith({ teamIndex: 3, correct: true });
    expect(dialog.close).toHaveBeenCalledOnce();
    expect(component.running()).toBe(false);
    expect(vi.getTimerCount()).toBe(0);
    expect(closed).not.toHaveBeenCalled();
    expect(finished).not.toHaveBeenCalled();
  });

  it.each(['close', 'finish'] as const)('%s stops the timer and emits only its corresponding event', action => {
    component[action]();
    expect(dialog.close).toHaveBeenCalledOnce();
    expect(component.running()).toBe(false);
    expect(vi.getTimerCount()).toBe(0);
    expect(action === 'close' ? closed : finished).toHaveBeenCalledOnce();
    expect(action === 'close' ? finished : closed).not.toHaveBeenCalled();
    expect(scored).not.toHaveBeenCalled();
  });

  it('cleans up its interval when destroyed', () => {
    vi.advanceTimersByTime(2000);
    component.ngOnDestroy();
    vi.advanceTimersByTime(60000);
    expect(component.seconds()).toBe(28);
    expect(component.running()).toBe(false);
    expect(vi.getTimerCount()).toBe(0);
  });
});
