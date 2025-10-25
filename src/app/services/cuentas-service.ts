import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BASE_URL } from './base-url';

@Injectable({
  providedIn: 'root'
})

export class CuentasService {
  constructor(private http: HttpClient) { }

  crearCuenta(data: CuentaData) {
    return this.http.post(`${BASE_URL}/cuentas`, data);
  }
}

export interface CuentaData {
  type: string;
  nickname: string;
  customer_id: string;
}