import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import {
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  ModalController,
} from '@ionic/angular/standalone';
import { Cliente, EstadoCliente } from 'src/app/interfaces/cliente';
import { EstadoOperacion } from 'src/app/interfaces/operaciones';
import { EstadoCuota, Periodo } from 'src/app/interfaces/credito';

@Component({
  selector: 'app-resumen-cliente',
  templateUrl: './resumen-cliente.component.html',
  styleUrls: ['./resumen-cliente.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
  ],
})
export class ResumenClienteComponent {
  @Input() cliente!: Cliente;

  estadosCliente = EstadoCliente;
  estadosVenta = EstadoOperacion;
  estadosCuota = EstadoCuota;
  periodos = Periodo;

  modalCtrl = inject(ModalController);

  constructor() {}

  async ionViewDidEnter() {
    this.printResumen();
  }

  printResumen() {
    const resumenInfo = document.getElementById('resumenCliente');
    if (!resumenInfo) return;

    // Obtener el nombre dinámico del archivo CSS de Angular
    const styles = Array.from(document.head.getElementsByTagName('link'))
      .filter(
        (link) => link.rel === 'stylesheet' && link.href.includes('styles')
      )
      .map((link) => `<link rel="stylesheet" href="${link.href}">`)
      .join('');

    const popup = window.open('', '_blank', 'width=800, height=600');
    if (popup) {
      popup.document.open();
      popup.document.write(`
        <html class="hydrated">
          <head>
            <title>Resumen - ${
              this.cliente.apellido + ', ' + this.cliente.nombre
            }</title>
            ${styles}
          </head>
          <body class="relative overflow-y-auto max-w-[210mm] mx-auto" onload="window.print();window.close()">
            ${resumenInfo.innerHTML}
          </body>
        </html>
      `);
      popup.document.close();
    }
    return this.modalCtrl.dismiss(null, 'confirm');
  }
}
