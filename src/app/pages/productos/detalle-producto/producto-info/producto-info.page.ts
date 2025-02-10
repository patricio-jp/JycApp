import { Component, inject, Input } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonContent,
  IonTitle,
  ModalController,
  IonLabel,
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { Producto } from 'src/app/interfaces/producto';

@Component({
  selector: 'app-producto-info',
  templateUrl: './producto-info.page.html',
  styleUrls: ['./producto-info.page.scss'],
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
  ],
})
export class ProductoInfoPage {
  @Input() producto?: Producto;

  modalCtrl = inject(ModalController);

  constructor() {}

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }
}
