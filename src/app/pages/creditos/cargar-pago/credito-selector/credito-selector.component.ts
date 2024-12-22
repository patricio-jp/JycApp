import { Component, computed, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonContent,
  IonTitle,
  ModalController,
  IonLabel,
  IonSearchbar,
  IonList,
  IonItem,
} from '@ionic/angular/standalone';
import { Credito, EstadoCredito, Periodo } from 'src/app/interfaces/credito';
import { CreditosService } from 'src/app/services/creditos.service';

@Component({
  selector: 'app-credito-selector',
  templateUrl: './credito-selector.component.html',
  styleUrls: ['./credito-selector.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonItem,
    IonList,
    IonSearchbar,
    IonLabel,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonContent,
    IonTitle,
  ],
})
export class CreditoSelectorComponent {
  @Input() credito?: Credito;

  private modalCtrl = inject(ModalController);
  private creditosService = inject(CreditosService);

  listadoCreditos = computed(() => this.creditosService.listadoCreditos());
  searchResults: Credito[] = [];

  periodos = Periodo;

  constructor() {
    this.creditosService.getCreditos();
    this.searchResults = [...this.listadoCreditos()];
  }

  searchCredito($event: any) {
    const query = $event.target.value.toUpperCase();
    this.searchResults = this.listadoCreditos().filter(
      (credito) =>
        credito.estado !== EstadoCredito.Anulado &&
        credito.estado !== EstadoCredito.Pagado &&
        (credito.venta.comprobante?.includes(query) ||
          credito.venta.cliente?.dni.toString().toUpperCase().includes(query) ||
          credito.venta.cliente?.apellido?.toUpperCase().includes(query) ||
          credito.venta.cliente?.nombre
            .toString()
            .toUpperCase()
            .includes(query) ||
          credito.venta.productos?.some((producto) =>
            producto.producto.nombre.toUpperCase().includes(query)
          ))
    );
  }

  select(credito: Credito) {
    this.credito = credito;
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    return this.modalCtrl.dismiss(this.credito, 'confirm');
  }
}
