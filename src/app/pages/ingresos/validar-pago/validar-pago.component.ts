import { CommonModule } from '@angular/common';
import { Component, OnDestroy, ViewChild } from '@angular/core';
import {
  IonContent,
  IonCard,
  IonCardTitle,
  IonCardHeader,
  IonCardContent,
} from '@ionic/angular/standalone';
import { Subscription } from 'rxjs';
import { VerReciboComponent } from '../ver-recibo/ver-recibo.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-validar-pago',
  templateUrl: './validar-pago.component.html',
  styleUrls: ['./validar-pago.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonCard,
    IonCardTitle,
    IonCardHeader,
    IonCardContent,
    VerReciboComponent,
    FaIconComponent,
  ],
})
export class ValidarPagoComponent implements OnDestroy {
  @ViewChild(VerReciboComponent)
  private reciboComponent!: VerReciboComponent;

  private subscriptions = new Subscription();

  constructor() {}

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  printRecibo() {
    this.reciboComponent.printRecibo();
  }

  sendViaWhatsapp() {
    this.reciboComponent.sendViaWhatsapp();
  }
}
