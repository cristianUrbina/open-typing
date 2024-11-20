import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { go } from "@codemirror/lang-go";
import { javascript } from '@codemirror/lang-javascript';
import { python } from "@codemirror/lang-python";
import { rust } from '@codemirror/lang-rust';
import { defaultHighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { StateEffect, StateField } from "@codemirror/state";
import { Decoration, EditorView, highlightActiveLine, highlightSpecialChars, lineNumbers } from "@codemirror/view";
import { capitalizeFirstLetter } from '../../utils/string-utils';
import { BackendService } from '../services/backend.service';
import { TypingGameService } from '../services/typing-game-service/typing-game.service';

const triggerUpdate = StateEffect.define();

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
  myView: EditorView | undefined;

  constructor(private backend: BackendService, public gameService: TypingGameService) { }

  @Input()
  set language(language: string) {
    this.lang = language;
    localStorage.setItem('preferredLanguage', language);
  }

  ngAfterViewInit(): void {
    this.getAndSetSnippet();
  }

  createLanguageExtension() {
    if (this.lang == "go") {
      return go();
    }
    else if (this.lang == "javascript") {
      return javascript();
    }
    else if (this.lang == "python") {
      return python();
    }
    else if (this.lang == "rust") {
      return rust();
    }
    else return go()
  }

  getAndSetSnippet() {
    this.backend.getCodeSnippet(this.lang)
      .subscribe({
        next: (snippet) => {
          this.gameService.codeSnippet = snippet.code;
          this.langImgUrl = snippet.langImgUrl;
          this.createEditorView();
        },
        error: (err) => {
          console.error("Error fetching code snippet", err);
        }
      });
  }

  createEditorView(): void {
    const codeEditor = document.querySelector('.editor');
    const parent = codeEditor ?? document.body;
    const languageExtension = this.createLanguageExtension();
    const createDecorations = this.createDecorations.bind(this);
    const backgroundField = StateField.define({
      create(state) {
        return createDecorations(state.doc.toString());
      },
      update(decorations, transaction) {
        if (transaction.docChanged || transaction.effects.some(e => e.is(triggerUpdate))) {
          return createDecorations(transaction.newDoc.toString());
        }
        return decorations;
      },
      provide(field) {
        return EditorView.decorations.from(field);
      },
    });

    const keyboardEventCatcher = EditorView.domEventHandlers({
      keydown: (event, view) => this.handleKeyboardEvent(event, view),
    })

    this.myView = new EditorView({
      doc: this.gameService.codeSnippet,
      extensions: [
        keyboardEventCatcher,
        highlightSpecialChars(),
        lineNumbers(),
        highlightActiveLine(),
        syntaxHighlighting(defaultHighlightStyle),
        languageExtension,
        backgroundField,
      ],
      parent: parent
    });
  }

  getBackgroundColor(pos: number) {
    if (this.gameService.isMisstyped(pos)) {
      return "#F8D7DA"
    }
    else if (this.gameService.isCorrect(pos)) {
      return "#E6F7E1"
    }
    else return "";
  }

  createDecorations(doc: any) {
    const decorations = [];

    for (let pos = 0; pos < doc.length; pos++) {
      const color = this.getBackgroundColor(pos);
      decorations.push(
        Decoration.mark({
          attributes: { style: `background-color: ${color};` },
        }).range(pos, pos + 1)
      );
    }

    return Decoration.set(decorations);
  }

  ngOnDestroy(): void {
    this.myView?.destroy();
  }

  get characters(): string[] {
    return this.gameService.characters;
  }

  get capitalizedLang(): string {
    return capitalizeFirstLetter(this.lang);
  }

  handleKeyboardEvent(event: KeyboardEvent, view: EditorView) {
    this.gameService.processInput(event);
    event.preventDefault();
    const curr = this.gameService.getCurrent()
    view.dispatch({
      effects: triggerUpdate.of(null)
    })
    view.dispatch(
      {
        selection: {anchor: curr, head: curr}
      }
    )
    return true
  }

}
