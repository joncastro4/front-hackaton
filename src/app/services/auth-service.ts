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

  setCustomerID(id: string) {
    this.cookies.set('customer_id', id, 7, '/');
  }

  getCustomerID() {
    return this.cookies.get('customer_id')
  }

  getUserNessieID(token: string) {
    console.log("Obteniendo Nessie ID con token:", token);
    return this.http.get(`${BASE_URL}/nessie-id`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    console.log("Token en auth service:", token);
    console.log("Token length:", token.length);
    if (token.length > 10) {
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
