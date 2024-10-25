import { Component, inject, Input } from '@angular/core';
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
  IonLabel,
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { Venta } from 'src/app/interfaces/operaciones';

@Component({
  selector: 'app-venta-info',
  templateUrl: './venta-info.page.html',
  styleUrls: ['./venta-info.page.scss'],
  standalone: true,
  imports: [
    IonLabel,
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
export class VentaInfoPage {
  @Input() venta?: Venta;

  modalCtrl = inject(ModalController);

  constructor() {}

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    return this.modalCtrl.dismiss(null, 'confirm');
  }
}
