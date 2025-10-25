import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class Purchases {
  private apiKey = 'e74c2feafa6f8b24c71ded25e2baeb2e';

  constructor(private http: HttpClient) {}

  getPurchases(accountId: string) {
    return this.http.get(`http://api.nessieisreal.com/accounts/${accountId}/purchases?key=${this.apiKey}`);
  }
  
  getMerchant(merchantId: string) {
    return this.http.get(`http://api.nessieisreal.com/merchants/${merchantId}?key=${this.apiKey}`);
  }
}