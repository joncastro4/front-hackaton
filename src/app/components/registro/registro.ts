import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Password } from 'primeng/password';
import { AuthService } from '../../services/auth-service';
import { ConnectedOverlayScrollHandler } from 'primeng/dom';

@Component({
  selector: 'app-registro',
  imports: [RouterLink, ReactiveFormsModule, ToastModule],
  templateUrl: './registro.html',
  styleUrl: './registro.css',
})
export class Registro {

  constructor(
    private messageService: MessageService,
    private authService: AuthService
  ) {}

  form = new FormGroup({
    nombres: new FormControl("", [Validators.required, Validators.minLength(3)]),
    apellidos: new FormControl("", [Validators.required, Validators.minLength(3)]),
    usuario: new FormControl("", [Validators.required, Validators.minLength(3)]),
    correo: new FormControl("", [Validators.required, Validators.email]),
    contrasena: new FormControl("", [Validators.required, Validators.minLength(8)]),
    numeroCalle: new FormControl("", [Validators.required, Validators.min(1)]),
    calle: new FormControl("", Validators.required),
    ciudad: new FormControl("", Validators.required),
    estado: new FormControl("", Validators.required),
    zip: new FormControl("", [Validators.minLength(5), Validators.maxLength(5), Validators.required])
  })

  showAlert(severity: string, summary: string, detail: string) {
    this.messageService.add({ severity: severity, summary: summary, detail: detail, key: 'br', life: 3000 });
  }

  registrarse() {
    if (this.form.valid) {
      const formData = {
        firstName: this.form.controls.nombres.value,
        lastName: this.form.controls.apellidos.value,
        username: this.form.controls.usuario.value,
        email: this.form.controls.correo.value,
        password: this.form.controls.contrasena.value,
        address: {
          street_number: this.form.controls.numeroCalle.value,
          street_name: this.form.controls.calle.value,
          city: this.form.controls.ciudad.value,
          state: this.form.controls.estado.value,
          zip: this.form.controls.zip.value
        }
      }

      this.authService.register(formData).subscribe({
        next: (response: any) => {
          console.log(response)
        },
        error: (error: any) => {
          this.showAlert("error", "Error al registrarse", "Ha ocurrido un error al momento de registrarse, intente nuevamente en unos minutos.")
          console.log(error)
        }
      })
    } else {
      this.showAlert("error", "Formulario invalido", "Alguno de los campos no estan llenados correctamente")
    }
  }

  estados: { state: string; code: string }[] = [
    { state: "Alabama", code: "AL" },
    { state: "Alaska", code: "AK" },
    { state: "Arizona", code: "AZ" },
    { state: "Arkansas", code: "AR" },
    { state: "California", code: "CA" },
    { state: "Colorado", code: "CO" },
    { state: "Connecticut", code: "CT" },
    { state: "Delaware", code: "DE" },
    { state: "Florida", code: "FL" },
    { state: "Georgia", code: "GA" },
    { state: "Hawaii", code: "HI" },
    { state: "Idaho", code: "ID" },
    { state: "Illinois", code: "IL" },
    { state: "Indiana", code: "IN" },
    { state: "Iowa", code: "IA" },
    { state: "Kansas", code: "KS" },
    { state: "Kentucky", code: "KY" },
    { state: "Louisiana", code: "LA" },
    { state: "Maine", code: "ME" },
    { state: "Maryland", code: "MD" },
    { state: "Massachusetts", code: "MA" },
    { state: "Michigan", code: "MI" },
    { state: "Minnesota", code: "MN" },
    { state: "Mississippi", code: "MS" },
    { state: "Missouri", code: "MO" },
    { state: "Montana", code: "MT" },
    { state: "Nebraska", code: "NE" },
    { state: "Nevada", code: "NV" },
    { state: "New Hampshire", code: "NH" },
    { state: "New Jersey", code: "NJ" },
    { state: "New Mexico", code: "NM" },
    { state: "New York", code: "NY" },
    { state: "North Carolina", code: "NC" },
    { state: "North Dakota", code: "ND" },
    { state: "Ohio", code: "OH" },
    { state: "Oklahoma", code: "OK" },
    { state: "Oregon", code: "OR" },
    { state: "Pennsylvania", code: "PA" },
    { state: "Rhode Island", code: "RI" },
    { state: "South Carolina", code: "SC" },
    { state: "South Dakota", code: "SD" },
    { state: "Tennessee", code: "TN" },
    { state: "Texas", code: "TX" },
    { state: "Utah", code: "UT" },
    { state: "Vermont", code: "VT" },
    { state: "Virginia", code: "VA" },
    { state: "Washington", code: "WA" },
    { state: "West Virginia", code: "WV" },
    { state: "Wisconsin", code: "WI" },
    { state: "Wyoming", code: "WY" }
  ]
}
