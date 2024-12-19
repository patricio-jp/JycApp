import { Component, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonSearchbar,
  IonButton,
  IonIcon,
  ModalController,
} from '@ionic/angular/standalone';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { VentasService } from 'src/app/services/ventas.service';
import { Cliente } from 'src/app/interfaces/cliente';
import { EstadoOperacion, Venta } from 'src/app/interfaces/operaciones';
import { VentaInfoPage } from '../detalle-venta/venta-info/venta-info.page';

@Component({
  selector: 'app-listado-ventas',
  templateUrl: './listado-ventas.page.html',
  styleUrls: ['./listado-ventas.page.scss'],
  standalone: true,
  imports: [
    IonIcon,
    IonButton,
    IonSearchbar,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    RouterLink,
    FaIconComponent,
  ],
})
export class ListadoVentasPage implements OnInit {
  constructor() {}

  private ventasService = inject(VentasService);

  private modalCtrl = inject(ModalController);

  private router = inject(Router);

  dataVentas = computed(() => this.ventasService.dataVentas());
  listadoVentas = computed(() => this.ventasService.listadoVentas());
  loadingSignal = computed(() => this.ventasService.loadingSignal());

  estadosVenta = EstadoOperacion;

  ngOnInit() {
    this.ventasService.getVentas();
  }

  async clientDetails(cliente: Cliente) {
    /* const modal = await this.modalCtrl.create({
      component: Cliente
    }) */
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
}
