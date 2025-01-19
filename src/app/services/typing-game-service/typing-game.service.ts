import { Injectable } from '@angular/core';
import { CodeCleaner } from './code-cleaner';
import { CountdownTimer } from './countdown-timer';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TypingGameService {
  private _snippet = '';
  private correctlyTypedCharsCount = 0;
  private incorrectlyTypedCharsCount = 0;
  private inputTyped: string[] = [];
  private correctedInputSource = new BehaviorSubject<string[]>([]);
  public correctedInput$ = this.correctedInputSource.asObservable();
  public WPM: number = 0;
  public timer = new CountdownTimer(60);

  get characters(): string[] {
    return this.codeSnippet.trim().split('');
  }

  get correctChars(): number {
    return this.correctlyTypedCharsCount;
  }

  get incorrectChars(): number {
    return this.incorrectlyTypedCharsCount;
  }

  set codeSnippet(snippet: string) {
    this._snippet = CodeCleaner.clean(snippet);
  }

  get codeSnippet() {
    return this._snippet;
  }

  start() {
    this.timer.start();
    this.setWPMPeriodically()
  }

  setWPMPeriodically() {
    this.WPM = Math.round(this.calculateWPM());
    setTimeout(() => this.setWPMPeriodically(), 1000);
  }

  calculateRemainingTime(): number {
    return this.timer.timeLeftInSeconds;
  }

  isActive(index: number): boolean {
    return this.getCurrent() === index;
  }

  setCorrectedInput(value: string[]) {
      this.correctedInputSource.next(value);
  }

  getCorrectedInput() {
    return this.correctedInputSource.getValue();
  }

  getCurrent(): number {
    return this.correctedInputSource.getValue().length;
  }

  pushChar(value: string): void {
    this.correctedInputSource.next([...this.getCorrectedInput(), value]);
  }

  processBackspace(): boolean {
    if (this.inputTyped.length > 0) {
      this.setCorrectedInput(this.getCorrectedInput().slice(0, -1));
      return true;
    }
    return false;
  }

  processInput(event: KeyboardEvent) {
    if (!this.timer.startTime) {
      this.start();
    }
    const key: string = event.key;
    if (key === 'Shift' || this.isComplete()) {
      return;
    }
    if (key === 'Backspace' && this.processBackspace()) {
      return;
    }
    const target = this.characters[this.getCurrent()];
    this.inputTyped.push(key);
    this.pushChar(key);
    const isCorrect = key === target || (key === 'Enter' && target === '\n');

    if (isCorrect) {
      this.correctlyTypedCharsCount += 1;
    } else {
      this.incorrectlyTypedCharsCount += 1;
    }

    // Go to the first character after newline
    if (key === 'Enter' && target === '\n') {
      while (this.getCurrent() < this.characters.length && this.characters[this.getCurrent()] === ' ') {
        // this.getCorrectedInput().push(' ');
        this.pushChar(' ')
      }
    }

    if (this.isComplete()) {
      this.endGame();
    }
  }

  calculateWPM(): number {
    if (!this.timer.startTime) return 0;
    const minutes = this.timer.timeElapsedInSeconds / 60;
    const wordsTyped = this.inputTyped.length / 5;
    if (wordsTyped == 0 || minutes == 0) {
      return 0;
    }
    return wordsTyped / minutes;
  }

  isMisstyped(i: number): boolean {
    return this.getCurrent() > i && this.getCorrectedInput()[i] !== this.codeSnippet[i];
  }

  isCorrect(i: number): boolean {
    return this.hasBeenTyped(i) && this.getCorrectedInput()[i] === this.codeSnippet[i];
  }

  hasBeenTyped(i: number): boolean {
    return this.getCurrent() > i;
  }

  endGame() {
    alert(`Congratulations you ended this snippet with an accuracy of ${this.getGameSummary().accuracy}%`);
    this.timer.stop();
  }

  isComplete(): boolean {
    return this.getCurrent() >= this.codeSnippet.length;
  }

  getAccuracy() {
    return Math.trunc((this.correctlyTypedCharsCount / this.inputTyped.length) * 100);
  }

  getGameSummary() {
    return {
      accuracy: this.getAccuracy()
    };
  }

  hasFinished(): boolean {
    return this.timer.hasFinished()
  }

  restart() {
    this.resetVariables();
  }

  private resetVariables(): void {
    this.correctlyTypedCharsCount = 0;
    this.incorrectlyTypedCharsCount = 0;
    this.inputTyped = [];
    this.setCorrectedInput([]);
    this.WPM = 0;
    this.timer = new CountdownTimer(60);
  }

  destroy() {
    this.codeSnippet = "";
  }
}
