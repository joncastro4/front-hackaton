import { Injectable } from '@angular/core';
import { BASE_URL } from './base-url';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TestService {
  readonly charactersBaseURL = BASE_URL + "/characters"

  constructor(
    private http: HttpClient
  ) {}

  getCharacters() {
    return this.http.get(this.charactersBaseURL)
  }
}
