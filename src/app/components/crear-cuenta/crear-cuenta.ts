import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-crear-cuenta',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './crear-cuenta.html',
  styleUrl: './crear-cuenta.css',
})

export class CrearCuenta {
  constructor(
    private messageService: MessageService
  ) {}

  form = new FormGroup({
    type: new FormControl("", Validators.required),
    nickname: new FormControl("", Validators.required),
    rewards: new FormControl("", Validators.required),
    balance: new FormControl("", Validators.required),
    account_number: new FormControl("", Validators.required),
    customer_id: new FormControl("", Validators.required),
  })

  showAlert(severity: string, summary: string, detail: string) {
    this.messageService.add({ severity: severity, summary: summary, detail: detail, key: 'br', life: 3000 });
  }

  crearCuenta() {
    if (this.form.valid) {
      const formData = {
        type: this.form.controls.type.value,
        nickname: this.form.controls.nickname.value,
        rewards: this.form.controls.rewards.value,
        balance: this.form.controls.balance.value,
        account_number: this.form.controls.account_number.value,
        customer_id: this.form.controls.customer_id.value
      }
      console.log('Crear cuenta payload:', formData);
    } else {
      this.showAlert("error", "Formulario invalido", "Alguno de los campos no estan llenados correctamente")
    }
  }
}
