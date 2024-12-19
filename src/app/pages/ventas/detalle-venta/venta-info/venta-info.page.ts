import { Component, inject, Input } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonContent,
  IonTitle,
  ModalController,
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import {
  CondicionOperacion,
  EstadoOperacion,
  Venta,
} from 'src/app/interfaces/operaciones';
import { Periodo, EstadoCredito, Credito } from 'src/app/interfaces/credito';
import { CreditoInfoComponent } from 'src/app/pages/creditos/detalle-credito/credito-info/credito-info.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-venta-info',
  templateUrl: './venta-info.page.html',
  styleUrls: ['./venta-info.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonContent,
    IonTitle,
    FaIconComponent,
  ],
})
export class VentaInfoPage {
  @Input() venta?: Venta;

  modalCtrl = inject(ModalController);

  condicionVenta = CondicionOperacion;
  estadosVenta = EstadoOperacion;
  periodosCredito = Periodo;
  estadosCredito = EstadoCredito;

  constructor() {}

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    return this.modalCtrl.dismiss(null, 'confirm');
  }

  async viewCreditoDetails(credito: Credito) {
    if (credito) {
      const modal = await this.modalCtrl.create({
        id: 'creditoModal',
        component: CreditoInfoComponent,
        componentProps: { credito },
        breakpoints: [0.25, 0.5, 1],
        initialBreakpoint: 0.25,
      });
      //console.log(credito);
      modal.present();

      const { data, role } = await modal.onWillDismiss();
    } else {
      alert('No crédito');
    }
    //console.log(data, role);
  }
}
