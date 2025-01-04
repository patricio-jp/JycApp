import { Component, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { ClientesService } from 'src/app/services/clientes.service';
import { VentasService } from 'src/app/services/ventas.service';
import { CreditosService } from 'src/app/services/creditos.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
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
export class HomePage implements OnInit {
  private clientesService = inject(ClientesService);
  private ventasService = inject(VentasService);
  private creditosService = inject(CreditosService);

  cantClientesTotales = computed(() =>
    this.clientesService.cantClientesTotales()
  );
  cantClientesPendientes = computed(() =>
    this.clientesService.cantPendientes()
  );
  cantClientesActivos = computed(() => this.clientesService.cantActivos());
  cantClientesConDeuda = computed(() => this.clientesService.cantConDeuda());

  cantVentasTotales = computed(() => this.ventasService.cantVentasTotales());
  cantVentasPendientes = computed(() =>
    this.ventasService.cantVentasPendientes()
  );
  cantVentasParaEntrega = computed(() =>
    this.ventasService.cantVentasParaEntrega()
  );

  cantCreditosTotales = computed(() =>
    this.creditosService.cantCreditosTotales()
  );
  cantCreditosPendientes = computed(() =>
    this.creditosService.cantCreditosPendientes()
  );
  cantCreditosActivos = computed(() =>
    this.creditosService.cantCreditosActivos()
  );
  cantCreditosEnDeuda = computed(() =>
    this.creditosService.cantCreditosEnDeuda()
  );
  cantCreditosSemanales = computed(() =>
    this.creditosService.cantCreditosActivosSemanales()
  );
  cantCreditosQuincenales = computed(() =>
    this.creditosService.cantCreditosActivosQuincenales()
  );
  cantCreditosMensuales = computed(() =>
    this.creditosService.cantCreditosActivosMensuales()
  );

  constructor() {}

  ngOnInit(): void {
    this.clientesService.getClientes();
    this.ventasService.getVentas();
    this.creditosService.getCreditos();
  }
}
