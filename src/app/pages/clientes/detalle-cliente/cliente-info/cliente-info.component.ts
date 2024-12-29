import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
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
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { Cliente, EstadoCliente } from 'src/app/interfaces/cliente';
import { EstadoOperacion, Venta } from 'src/app/interfaces/operaciones';
import { VentaInfoPage } from 'src/app/pages/ventas/detalle-venta/venta-info/venta-info.page';
import { ClientesService } from 'src/app/services/clientes.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cliente-info',
  templateUrl: './cliente-info.component.html',
  styleUrls: ['./cliente-info.component.scss'],
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
export class ClienteInfoComponent implements OnInit, OnDestroy {
  @Input() clienteID!: number;
  cliente!: Cliente;

  private clientesService = inject(ClientesService);

  private suscriptions = new Subscription();

  modalCtrl = inject(ModalController);

  estadosCliente = EstadoCliente;
  estadosVenta = EstadoOperacion;

  constructor() {}

  ngOnInit(): void {
    this.suscriptions.add(
      this.clientesService
        .getCliente(this.clienteID)
        .subscribe((cliente) => (this.cliente = cliente))
    );
  }
  ngOnDestroy(): void {
    this.suscriptions.unsubscribe();
  }
  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    return this.modalCtrl.dismiss(null, 'confirm');
  }

  async ventaDetails(venta: Venta) {
    const modal = await this.modalCtrl.create({
      component: VentaInfoPage,
      componentProps: { venta: venta },
      breakpoints: [0.5, 1],
      initialBreakpoint: 0.5,
    });

    modal.present();

    const { data, role } = await modal.onWillDismiss();
  }
}
