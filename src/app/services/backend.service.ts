import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  constructor(private http: HttpClient) { }

  getCodeSnippet(lang: string): Observable<any> {
    let filePath = `assets/code-snippets/${lang}.txt`;
    return this.http.get(filePath, { responseType: 'text' });
  }
}
