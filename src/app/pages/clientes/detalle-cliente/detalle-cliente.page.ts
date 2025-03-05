import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardContent,
  ModalController,
} from '@ionic/angular/standalone';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { Cliente, EstadoCliente } from 'src/app/interfaces/cliente';
import { EstadoOperacion, Venta } from 'src/app/interfaces/operaciones';
import { ClientesService } from 'src/app/services/clientes.service';
import { VentaInfoPage } from '../../ventas/detalle-venta/venta-info/venta-info.page';
import { Subscription } from 'rxjs';
import { ResumenClienteComponent } from './resumen-cliente/resumen-cliente.component';
import { EstadoCredito, Periodo } from 'src/app/interfaces/credito';

@Component({
  selector: 'app-detalle-cliente',
  templateUrl: './detalle-cliente.page.html',
  styleUrls: ['./detalle-cliente.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonCard,
    IonCardContent,
    FaIconComponent,
  ],
})
export class DetalleClientePage implements OnDestroy {
  route: ActivatedRoute = inject(ActivatedRoute);
  private clientesService = inject(ClientesService);
  private router = inject(Router);
  private modalCtrl = inject(ModalController);

  private suscriptions = new Subscription();

  cliente?: Cliente;

  estadosCliente = EstadoCliente;
  estadosVenta = EstadoOperacion;
  periodos = Periodo;
  estadosCredito = EstadoCredito;

  constructor() {
    const clienteID = Number(this.route.snapshot.params['id']);
    this.suscriptions.add(
      this.clientesService
        .getCliente(clienteID)
        .subscribe((cliente) => (this.cliente = cliente))
    );
  }
  ngOnDestroy(): void {
    this.suscriptions.unsubscribe();
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

  ventaDesktopDetails(id?: number) {
    this.router.navigate(['./dashboard/ventas/detalle', id]);
  }

  async generarResumen() {
    const modal = await this.modalCtrl.create({
      component: ResumenClienteComponent,
      componentProps: { cliente: this.cliente },
    });

    modal.present();
  }
}
