import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

export interface CodeSnippet {
  code: string;
  lang: string;
  langImgUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  constructor(private http: HttpClient) { }

  getCodeSnippet(lang: string): Observable<CodeSnippet> {
    let filePath = `assets/code-snippets/${lang}.txt`;
    return this.http.get(filePath, { responseType: 'text' })
      .pipe(
        map(snippet => {
          return {
            code: snippet,
            lang: lang,
            langImgUrl: `assets/images/${lang}-logo.png`,
          }
        })
      );
  }
}
