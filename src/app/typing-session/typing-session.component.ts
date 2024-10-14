import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HostListener } from '@angular/core';
import { TypingGameService } from '../services/typing-game-service/typing-game.service';
import { capitalizeFirstLetter } from '../../utils/string-utils';

@Component({
  selector: 'app-typing-session',
  standalone: true,
  imports: [HttpClientModule, CommonModule, FormsModule],
  templateUrl: './typing-session.component.html',
  styleUrl: './typing-session.component.scss'
})
export class TypingSessionComponent {
  lang: string = '';
  wpm: number = 0;

  constructor(private http: HttpClient, public gameService: TypingGameService) { }

  getCodeSnippet() {
    let filePath = `assets/code-snippets/${this.lang}.txt`;

    this.http.get(filePath, { responseType: 'text' })
      .subscribe({
        next: (snippet) => {
          this.gameService.setCodeSnippet(snippet);
        },
        error: (err) => {
          console.error("Error fetching code snippet", err);
          this.gameService.setCodeSnippet("Error loading snippet.");
        }
      });
    setTimeout(() => {
      this.wpm = this.gameService.calculateWPM();
    }, 1000)
  }

  get characters(): string[] {
    return this.gameService.characters;
  }

  get capitalizedLang(): string {
    return capitalizeFirstLetter(this.lang);
  }

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    this.gameService.processInput(event)
  }

  @Input()
  set language(language: string) {
    this.lang = language;
    this.getCodeSnippet()
  }
}
