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
    private cookies: CookieService,
  ) { }

  register(data: any) {
    return this.http.post(`${BASE_URL}/register`, data)
  }

  login(data: any) {
    return this.http.post(`${BASE_URL}/login`, data)
  }

  logOut() {
    this.cookies.delete('token', );
  }

  getToken() {
    return this.cookies.get('token')
  }

  setLocalToken(token: string) {
    this.cookies.set('token', token, 7, '/');
  }

  getUserNessieID(token: string) {
    return this.http.get(`${BASE_URL}/me`)
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    console.log("Token en auth service:", token);
    console.log("Token length:", token.length);
    if (token.length > 1) {
      return true;
    }
    return false;
  }

  redirectToLogin() {
    window.location.href = '/iniciar-sesion';
  }
  
  redirectToDashboard() {
    window.location.href = '/dashboard';
  }
}
