import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-registro',
  imports: [RouterLink, ReactiveFormsModule, ToastModule],
  templateUrl: './registro.html',
  styleUrl: './registro.css',
})
export class Registro {

  constructor(
    private messageService: MessageService
  ) {}

  form = new FormGroup({
    nombre: new FormControl("", [Validators.required, Validators.minLength(3)]),
    correo: new FormControl("", [Validators.required, Validators.email]),
    contrasena: new FormControl("", [Validators.required, Validators.minLength(8)])
  })

  showAlert(severity: string, summary: string, detail: string) {
    this.messageService.add({ severity: severity, summary: summary, detail: detail, key: 'br', life: 3000 });
  }

  registrarse() {
    if (this.form.valid) {
      const formData = {
        nombre: this.form.controls.nombre.value,
        correo: this.form.controls.correo.value,
        contrasena: this.form.controls.contrasena.value,
      }

      // API

    } else {
      this.showAlert("error", "Formulario invalido", "Alguno de los campos no estan llenados correctamente")
    }
  }
}
