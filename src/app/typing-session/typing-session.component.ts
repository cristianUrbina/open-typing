import { CommonModule } from '@angular/common';
import { Component, Input, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { capitalizeFirstLetter } from '../../utils/string-utils';
import { BackendService } from '../services/backend.service';
import { TypingGameService } from '../services/typing-game-service/typing-game.service';
import { MatIconModule } from '@angular/material/icon';
import { TypingEditorComponent } from '../typing-editor/typing-editor.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-typing-session',
  standalone: true,
  imports: [CommonModule, FormsModule, MatChipsModule, MatIconModule, TypingEditorComponent, RouterLink],
  templateUrl: './typing-session.component.html',
  styleUrl: './typing-session.component.scss'
})
export class TypingSessionComponent {
  lang: string = '';
  langImgUrl: string = '';
  wpm: number = 0;
  @ViewChild(TypingEditorComponent) editor!: TypingEditorComponent;

  constructor(private backend: BackendService, public gameService: TypingGameService) { }

  @Input()
  set language(language: string) {
    this.lang = language;
    localStorage.setItem('preferredLanguage', language);
  }

  get capitalizedLang(): string {
    return capitalizeFirstLetter(this.lang);
  }

  ngAfterViewInit(): void {
    this.backend.getCodeSnippet(this.lang)
      .subscribe({
        next: (snippet) => {
          this.gameService.codeSnippet = snippet.code;
          this.langImgUrl = snippet.langImgUrl;
        },
        error: (err) => {
          console.error("Error fetching code snippet", err);
        }
      });
  }

  restart(): void {
    this.gameService.restart();
    this.editor.restart();
  }

  ngOnDestroy() {
    this.gameService.destroy();
    this.gameService.restart();
  }
}
