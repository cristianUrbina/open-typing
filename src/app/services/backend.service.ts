import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

export interface Language {
  id: number;
  name: string;
  alias: string;
  logo_url: string;
  extensions: string[];
  capabilities: string[];
}

export interface CodeSnippet {
  code: string;
  lang: string;
}

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  constructor(private http: HttpClient) { }
  apiUrl = "http://my-api-alb-909059464.us-east-2.elb.amazonaws.com:8080";
  getLanguageByName(lang: string): Observable<Language> {
    const apiUrl = `${this.apiUrl}/languages/${lang}`;

    return this.http.get<{ id: number, name: string, alias: string, LogoURL: string, extensions: string[], capabilities: string[] }>(apiUrl)
      .pipe(
        map(response => {
        console.log("language", response)
          return {
            id: response.id,
            name: response.name,
            alias: response.alias,
            logo_url: response.LogoURL,
            extensions: response.extensions,
            capabilities: response.capabilities
          };
        })
      );
  }

  getAllLanguages(): Observable<Language[]> {
    const apiUrl = `${this.apiUrl}/languages`;

    return this.http.get<{ id: number, name: string, alias: string, logo_url: string, extensions: string[], capabilities: string[] }[]>(apiUrl)
      .pipe(
        map(response => {
          return response.map(lang => ({
            id: lang.id,
            name: lang.name,
            alias: lang.alias,
            logo_url: lang.logo_url,
            extensions: lang.extensions,
            capabilities: lang.capabilities
          }));
        })
      );
  }

  getCodeSnippet(lang: string): Observable<CodeSnippet> {
    const apiUrl = `${this.apiUrl}/snippets/${lang}`;

    return this.http.get<{ name: string, content: string, language: string, repository: string, repo_dir: string }>(apiUrl)
      .pipe(
        map(response => {
          return {
            code: response.content,
            lang: response.language,
          };
        })
      );
  }
}
