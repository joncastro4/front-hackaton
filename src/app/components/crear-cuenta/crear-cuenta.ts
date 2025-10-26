import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { CuentasService } from '../../services/cuentas-service';
import { CuentaData } from '../../services/cuentas-service';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-crear-cuenta',
  imports: [ReactiveFormsModule, RouterLink, ToastModule],
  templateUrl: './crear-cuenta.html',
  styleUrl: './crear-cuenta.css',
})

export class CrearCuenta {
  constructor(
    private messageService: MessageService,
    private cuentasService: CuentasService,
    private authService: AuthService,
  ) {}

  form = new FormGroup({
    type: new FormControl("", Validators.required),
    nickname: new FormControl("", Validators.required),
  })

  showAlert(severity: string, summary: string, detail: string) {
    this.messageService.add({ severity: severity, summary: summary, detail: detail, key: 'br', life: 3000 });
  }

  crearCuenta() {
    if (this.form.valid) {
      const data: CuentaData = {
        type: this.form.controls.type.value ?? "",
        nickname: this.form.controls.nickname.value ?? "",
        customer_id: "123456789"  // Este valor debe ser obtenido del contexto de la aplicación
      }
      this.cuentasService.crearCuenta(data).subscribe({
        next: (response) => {
          this.showAlert("success", "Cuenta creada", "La cuenta ha sido creada exitosamente.");
        },
        error: (error) => {
          this.showAlert("error", "Error al crear cuenta", "Hubo un problema al crear la cuenta. Intenta nuevamente.");
        }
      });
      console.log('Crear cuenta payload:', data);
    } else {
      this.showAlert("error", "Formulario inválido", "Alguno de los campos no están llenados correctamente");
    }
  }
}
