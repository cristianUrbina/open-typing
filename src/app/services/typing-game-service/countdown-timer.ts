export class CountdownTimer {
  private intervalId: number | undefined;
  private timeLeft: number; // in seconds
  private duration: number;
  private _startTime: number | undefined;

  constructor(duration: number) {
    this.timeLeft = duration;
    this.duration = duration;
  }

  get timeLeftInSeconds() {
    return this.timeLeft;
  }

  get timeElapsedInSeconds() {
    return this.duration - this.timeLeft;
  }

  start() {
    this._startTime = Date.now()
    this.intervalId = window.setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        alert('Timer finished!');
        this.stop();
      }
    }, 1000);
  }

  get startTime(): number | undefined {
    return this._startTime;
  }

  stop() {
    if (this.intervalId !== undefined) {
      window.clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
  }
}

