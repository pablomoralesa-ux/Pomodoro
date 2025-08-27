/**
 * Controls the countdown logic for Pomodoro sessions.
 */
export default class Timer {
  constructor(duration, { onTick, onComplete } = {}) {
    this.initialDuration = duration;
    this.remaining = duration;
    this.intervalId = null;
    this.onTick = onTick;
    this.onComplete = onComplete;
  }

  start() {
    if (this.intervalId) return;
    this.intervalId = setInterval(() => {
      this.remaining--;
      if (this.onTick) this.onTick(this.remaining);
      if (this.remaining <= 0) {
        this.pause();
        this.remaining = 0;
        if (this.onComplete) this.onComplete();
      }
    }, 1000);
  }

  pause() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  reset(duration = this.initialDuration) {
    this.pause();
    this.initialDuration = duration;
    this.remaining = duration;
    if (this.onTick) this.onTick(this.remaining);
  }
}
