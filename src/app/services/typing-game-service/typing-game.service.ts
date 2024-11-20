import { Injectable } from '@angular/core';
import { CodeCleaner } from './code-cleaner';
import { CountdownTimer } from './countdown-timer';

@Injectable({
  providedIn: 'root'
})
export class TypingGameService {
  private codeSnippet = '';
  private correctlyTypedCharsCount = 0;
  private incorrectlyTypedCharsCount = 0;
  private inputTyped: string[] = [];
  private correctedInput: string[] = [];
  public WPM: number = 0;
  public timer = new CountdownTimer(60);

  start() {
    this.timer.start();
    this.setWPMPeriodically()
  }

  setWPMPeriodically() {
    this.WPM = Math.round(this.calculateWPM());
    setTimeout(() => this.setWPMPeriodically(), 1000);
  }

  setCodeSnippet(snippet: string) {
    this.codeSnippet = CodeCleaner.clean(snippet);
  }

  get characters(): string[] {
    return this.codeSnippet.trim().split('');
  }

  calculateRemainingTime(): number {
    return this.timer.timeLeftInSeconds;
  }

  get correctChars(): number {
    return this.correctlyTypedCharsCount;
  }

  get incorrectChars(): number {
    return this.incorrectlyTypedCharsCount;
  }

  isActive(index: number): boolean {
    return this.correctedInput.length === index;
  }

  processInput(event: KeyboardEvent) {
    if (!this.timer.startTime) {
      this.start();
    }
    const key: string = event.key;
    if (key === 'Shift' || this.isComplete()) {
      return;
    }
    if(key === 'Backspace' && this.inputTyped.length > 0) {
      this.correctedInput = this.correctedInput.slice(0, -1);
      return;
    }
    const target = this.characters[this.correctedInput.length];
    this.inputTyped.push(key);
    this.correctedInput.push(key);
    const isCorrect = key === target || (key === 'Enter' && target === '\n');

    if (isCorrect) {
      this.correctlyTypedCharsCount += 1;
    } else {
      this.incorrectlyTypedCharsCount += 1;
    }

    // Go to the first character after newline
    if (key === 'Enter' && target === '\n') {
      while (this.correctedInput.length < this.characters.length && this.characters[this.correctedInput.length] === ' ') {
        console.log(this.correctedInput.length);
        console.log(this.characters[this.correctedInput.length])
        this.correctedInput.push(' ');
      }
    }

    if (this.correctedInput.length == this.characters.length) {
      this.endGame();
    }
  }

  endGame() {
    alert("Congratulations you ended this snippet");
    this.timer.stop();
  }

  isComplete(): boolean {
    return this.correctedInput.length >= this.codeSnippet.length;
  }

  calculateWPM(): number {
    if (!this.timer.startTime) return 0;
    const minutes = this.timer.timeElapsedInSeconds / 60;
    const wordsTyped = this.inputTyped.length / 5;
    if(wordsTyped == 0 || minutes == 0) {
      return 0;
    }
    return wordsTyped / minutes;
  }

  isMisstyped(i: number): boolean {
    return this.correctedInput.length > i && this.correctedInput[i] !== this.codeSnippet[i];
  }
}
