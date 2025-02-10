import { Component, inject, Input } from '@angular/core';
import {
  Credito,
  EstadoCredito,
  EstadoCuota,
  Periodo,
} from 'src/app/interfaces/credito';
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

@Component({
  selector: 'app-credito-info',
  templateUrl: './credito-info.component.html',
  styleUrls: ['./credito-info.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonContent,
    IonTitle,
  ],
})
export class CreditoInfoComponent {
  @Input() credito?: Credito;

  estadosCreditos = EstadoCredito;
  estadosCuota = EstadoCuota;
  periodos = Periodo;

  modalCtrl = inject(ModalController);

  constructor() {}

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }
}
