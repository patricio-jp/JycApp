import { Component, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonLoading,
  IonSpinner,
  IonSearchbar,
  IonButton,
  IonIcon,
  ModalController,
} from '@ionic/angular/standalone';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { VentasService } from 'src/app/services/ventas.service';
import { Cliente } from 'src/app/interfaces/cliente';
import { Venta } from 'src/app/interfaces/operaciones';

@Component({
  selector: 'app-listado-ventas',
  templateUrl: './listado-ventas.page.html',
  styleUrls: ['./listado-ventas.page.scss'],
  standalone: true,
  imports: [
    IonIcon,
    IonButton,
    IonSearchbar,
    IonSpinner,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonLoading,
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

  ngOnInit() {
    this.ventasService.getVentas();
  }

  async clientDetails(cliente: Cliente) {
    /* const modal = await this.modalCtrl.create({
      component: Cliente
    }) */
  }

  async ventaDetails(venta: Venta) {
    /* const modal = await this.modalCtrl.create({

    }) */
  }

  ventaDesktopDetails(id?: number) {
    this.router.navigate(['./dashboard/ventas/detalle', id]);
  }
}
