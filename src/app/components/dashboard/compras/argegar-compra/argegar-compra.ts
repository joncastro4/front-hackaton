import { Component, OnInit } from '@angular/core';
import { SectionHeader } from "../../section-header/section-header";
import { ToastModule } from 'primeng/toast';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MerchantService } from '../../../../services/merchant-service';
import { MessageService } from 'primeng/api';
import { Purchases } from '../../../../services/purchases';
import { AuthService } from '../../../../services/auth-service';

@Component({
  selector: 'app-argegar-compra',
  imports: [SectionHeader, ToastModule, ReactiveFormsModule],
  templateUrl: './argegar-compra.html',
  styleUrl: './argegar-compra.css',
})
export class ArgegarCompra implements OnInit {

  mercaderes: Array<any> = []

  constructor(
    private merchantService: MerchantService,
    private messageService: MessageService,
    private purchaseService: Purchases,
    private authService: AuthService
  ) {}

  form = new FormGroup({
    merchant_id: new FormControl("", [Validators.required]),
    medium: new FormControl("", [Validators.required]),
    purchase_date: new FormControl("", [Validators.required]),
    amount: new FormControl("", [Validators.required, Validators.min(0.01)])
  })

  userNessieId: string = ""

  ngOnInit(): void {
    this.merchantService.getMerchants().subscribe({
      next: (response: any) => {
        this.mercaderes = response
      },
      error: (error: any) => {
        console.log(error)
      }
    })

    this.authService.getUserNessieID(this.authService.getToken()).subscribe({
      next: (response: any) => {
        this.userNessieId = response._id
        console.log(this.userNessieId)
      },
      error: (error: any) => {
        console.log(error)
      }
    })
  }

  showAlert(severity: string, summary: string, detail: string) {
    this.messageService.add({ severity: severity, summary: summary, detail: detail, key: 'br', life: 3000 });
  }

  agregarCompra() {
    if (this.form.valid) {
      const formData = {
        merchant_id: this.form.controls.merchant_id.value,
        medium: this.form.controls.medium.value,
        purchase_date: this.form.controls.purchase_date.value,
        amount: this.form.controls.amount.value
      }

      this.purchaseService.postPurchase(this.userNessieId, formData).subscribe({
        next: (response: any) => {
          console.log(response)
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
