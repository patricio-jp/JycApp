import { Component, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { VentasService } from 'src/app/services/ventas.service';

@Component({
  selector: 'app-ventas-dashboard',
  templateUrl: './ventas-dashboard.page.html',
  styleUrls: ['./ventas-dashboard.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
  ],
})
export class VentasDashboardPage implements OnInit {
  ventasService = inject(VentasService);

  cantVentasTotales = computed(() => this.ventasService.cantVentasTotales());
  cantVentasPendientes = computed(() =>
    this.ventasService.cantVentasPendientes()
  );
  cantVentasParaEntrega = computed(() =>
    this.ventasService.cantVentasParaEntrega()
  );
  cantVentasPagadas = computed(() => this.ventasService.cantVentasPagadas());
  cantVentasEntregadas = computed(() =>
    this.ventasService.cantVentasEntregadas()
  );
  cantVentasAnuladas = computed(() => this.ventasService.cantVentasAnuladas());
  cantVentasACredito = computed(() => this.ventasService.cantVentasACredito());
  cantVentasAlContado = computed(() =>
    this.ventasService.cantVentasAlContado()
  );

  ngOnInit() {
    this.ventasService.getCounters();
  }
}
