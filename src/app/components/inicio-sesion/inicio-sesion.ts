import { Component } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-inicio-sesion',
  imports: [RouterLink, ReactiveFormsModule, ToastModule],
  templateUrl: './inicio-sesion.html',
  styleUrl: './inicio-sesion.css',
})
export class InicioSesion {

  constructor(
    private messageService: MessageService,
    private authService: AuthService,
    private router: Router
  ) {}

  showAlert(severity: string, summary: string, detail: string) {
    this.messageService.add({ severity: severity, summary: summary, detail: detail, key: 'br', life: 3000 });
  }

  form = new FormGroup({
    username: new FormControl("", [Validators.required]),
    password: new FormControl("", [Validators.required])
  })

  iniciarSesion() {
    if (this.form.valid) {
      const formData = {
        username: this.form.controls.username.value,
        password: this.form.controls.password.value
      }

      this.authService.login(formData).subscribe({
        next: (response: any) => {
          let token = response.token
          this.authService.setLocalToken(token)
          this.showAlert("success", "Registro exitoso", "Ahora podra registrar cuentas bancarias.")
          setTimeout(() => {
            this.router.navigate(['/dashboard/inicio'])
          }, 3000)
        },
        error: (error: any) => {
          console.log(error)
        }
      })

    } else {
      this.showAlert("error", "Formulario invalido", "Alguno de los campos no estan llenados correctamente")
    }
  }
}
