import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BASE_URL } from './base-url';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient
  ) { }

  readonly authURL =  BASE_URL + "auth/"

  register(data: any) {
    return this.http.post(this.authURL + "register", data)
  }

  login(data: any) {
    return this.http.post(this.authURL + "login", data)
  }
}
