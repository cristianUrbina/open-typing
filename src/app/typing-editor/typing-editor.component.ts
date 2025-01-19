import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { StateEffect, StateField } from "@codemirror/state";
import { go } from "@codemirror/lang-go";
import { javascript } from '@codemirror/lang-javascript';
import { python } from "@codemirror/lang-python";
import { rust } from '@codemirror/lang-rust';
import { TypingGameService } from '../services/typing-game-service/typing-game.service';
import { Decoration, EditorView, highlightActiveLine, highlightSpecialChars, lineNumbers } from "@codemirror/view";
import { defaultHighlightStyle, syntaxHighlighting } from "@codemirror/language";

const triggerUpdate = StateEffect.define();

@Component({
  selector: 'app-typing-editor',
  standalone: true,
  imports: [],
  templateUrl: './typing-editor.component.html',
  styleUrl: './typing-editor.component.scss'
})
export class TypingEditorComponent {

  private _doc: string | undefined;
  @ViewChild('editorContainer') editor: ElementRef | undefined;
  editorView: EditorView | undefined;
  lang: string | undefined;

  constructor(public gameService: TypingGameService) { }

  @Input()
  set language(language: string) {
    this.lang = language;
  }

  @Input()
  set code(doc: string) {
    this._doc = doc;

    if (this.gameService.codeSnippet !== "") {
      this.createEditorView();
    }
  }

  ngAfterViewInit() {
    this.gameService.correctedInput$.subscribe((_) => {
      const curr = this.gameService.getCurrent();
      this.editorView?.dispatch(
        {
          selection: { anchor: curr, head: curr }
        }
      )
      this.forceUpdateView();
    })
  }

  restart(): void {
    this.editorView?.destroy();
    this.createEditorView();
    this.forceUpdateView();
  }

  forceUpdateView(): void {
    this.editorView?.dispatch({
      effects: triggerUpdate.of(null)
    })
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

  createEditorView(): void {
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
      keydown: (event, view) => this.handleKeyboardEvent(event, view)
    })

    this.editorView = new EditorView({
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
      parent: this.editor?.nativeElement
    });
    this.editorView.focus();
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

  getBackgroundColor(pos: number) {
    if (this.gameService.isMisstyped(pos)) {
      return "#F8D7DA"
    }
    else if (this.gameService.isCorrect(pos)) {
      return "#E6F7E1"
    }
    else return "";
  }

  handleKeyboardEvent(event: KeyboardEvent, view: EditorView) {
    this.gameService.processInput(event);
    return true
  }

  ngOnDestroy() {
    this.editorView?.destroy();
    // this._doc = undefined;
  }
}
