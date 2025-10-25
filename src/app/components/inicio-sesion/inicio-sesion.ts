import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-inicio-sesion',
  imports: [RouterLink, ReactiveFormsModule, ToastModule],
  templateUrl: './inicio-sesion.html',
  styleUrl: './inicio-sesion.css',
})
export class InicioSesion {

  constructor(
    private messageService: MessageService
  ) {}

  showAlert(severity: string, summary: string, detail: string) {
    this.messageService.add({ severity: severity, summary: summary, detail: detail, key: 'br', life: 3000 });
  }

  form = new FormGroup({
    correo: new FormControl("", [Validators.email, Validators.required]),
    contrasena: new FormControl("", [Validators.required])
  })

  iniciarSesion() {
    if (this.form.valid) {
      const formData = {
        correo: this.form.controls.correo.value,
        contrasena: this.form.controls.contrasena.value
      }

      // ENVIAR EL REQUEST AL INICIO DE SESION EN EL API

    } else {
      this.showAlert("error", "Formulario invalido", "Alguno de los campos no estan llenados correctamente")
    }
  }
}
