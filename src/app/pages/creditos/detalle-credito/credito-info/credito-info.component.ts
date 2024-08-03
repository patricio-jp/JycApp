import { Component, inject, Input, OnInit } from '@angular/core';
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
  IonCard,
  IonCardContent,
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
    IonCard,
    IonCardContent,
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

  confirm() {
    return this.modalCtrl.dismiss(null, 'confirm');
  }
}
