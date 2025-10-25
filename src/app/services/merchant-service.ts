import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MerchantService {
  
  constructor(
    private http: HttpClient
  ) {}

  readonly API = "http://api.nessieisreal.com/merchants?key=e74c2feafa6f8b24c71ded25e2baeb2e"

  getMerchants() {
    return this.http.get(this.API)
  }
}
