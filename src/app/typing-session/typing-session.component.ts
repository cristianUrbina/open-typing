import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HostListener } from '@angular/core';

@Component({
  selector: 'app-typing-session',
  standalone: true,
  imports: [HttpClientModule, CommonModule, FormsModule],
  templateUrl: './typing-session.component.html',
  styleUrl: './typing-session.component.scss'
})
export class TypingSessionComponent {
  selectedLanguage = "javascript";
  codeSnippet: string = '';
  userInput: string = '';
  current = 0;

  constructor(private http: HttpClient) {}

  getCodeSnippet(){
    let filePath = `assets/code-snippets/${this.selectedLanguage}.txt`;

    this.http.get(filePath, { responseType: 'text' })
      .subscribe({
        next: (snippet) => {
          this.codeSnippet = snippet;
        },
        error: (err) => {
          console.error("Error fetching code snippet", err);
          this.codeSnippet = "Error loading snippet.";
        }
      });
  }

  checkTyping(e: Event) {

  }

  ngOnInit() {
    this.getCodeSnippet();
  }

  handleKeyPress() {

  }

  get characters() : string[] {
    return this.codeSnippet.trim().split('');
  }

  isActive(index: number) : boolean {
    return this.current == index;
  }

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
  }
}
