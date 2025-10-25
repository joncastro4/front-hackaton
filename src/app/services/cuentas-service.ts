import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BASE_URL } from './base-url';

@Injectable({
  providedIn: 'root'
})
export class CuentasService {
  constructor(private http: HttpClient) { }

  crearCuenta(data: {type: string, nickname: string, customer_id: string}) {
    return this.http.post(`${BASE_URL}/cuentas`, data);
  }
}
