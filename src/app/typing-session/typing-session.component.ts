import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HostListener } from '@angular/core';
import { TypingGameService } from '../services/typing-game-service/typing-game.service';
import { capitalizeFirstLetter } from '../../utils/string-utils';
import { MatChipsModule } from '@angular/material/chips';
import { BackendService } from '../services/backend.service';

@Component({
  selector: 'app-typing-session',
  standalone: true,
  imports: [CommonModule, FormsModule, MatChipsModule],
  templateUrl: './typing-session.component.html',
  styleUrl: './typing-session.component.scss'
})
export class TypingSessionComponent {
  lang: string = '';
  langImgUrl: string = '';
  wpm: number = 0;

  constructor(private backend: BackendService, public gameService: TypingGameService) { }

  @Input()
  set language(language: string) {
    this.lang = language;
    this.getAndSetSnippet();
    localStorage.setItem('preferredLanguage', language);
  }

  getAndSetSnippet() {
    this.backend.getCodeSnippet(this.lang)
      .subscribe({
        next: (snippet) => {
          this.gameService.setCodeSnippet(snippet.code);
          this.langImgUrl = snippet.langImgUrl;
        },
        error: (err) => {
          console.error("Error fetching code snippet", err);
        }
      });
  }

  get characters(): string[] {
    return this.gameService.characters;
  }

  get capitalizedLang(): string {
    return capitalizeFirstLetter(this.lang);
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    this.gameService.processInput(event)
  }

}
