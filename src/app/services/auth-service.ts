import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BASE_URL } from './base-url';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
    private cookies: CookieService
  ) { }

  readonly authURL =  BASE_URL + "/auth"

  register(data: any) {
    return this.http.post(this.authURL + "/register", data)
  }

  login(data: any) {
    return this.http.post(this.authURL + "/login", data)
  }

  logOut() {
    this.cookies.set('token', "")
  }

  getToken() {
    return this.cookies.get('token')
  }

  setLocalToken(token: string) {
    this.cookies.set('token', token, 7, '/');
  }

  getUserNessieID(token: string) {
    return this.http.get(this.authURL + "/me")
  }
}
