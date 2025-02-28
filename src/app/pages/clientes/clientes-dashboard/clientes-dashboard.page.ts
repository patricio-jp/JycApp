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

@Component({
  selector: 'app-clientes-dashboard',
  templateUrl: './clientes-dashboard.page.html',
  styleUrls: ['./clientes-dashboard.page.scss'],
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
export class ClientesDashboardPage implements OnInit {
  private clientesService = inject(ClientesService);

  //listadoClientes = computed(() => this.clientesService.listadoClientes());
  cantClientes = computed(() => this.clientesService.cantClientesTotales());
  cantPendientes = computed(() => this.clientesService.cantPendientes());
  cantActivos = computed(() => this.clientesService.cantActivos());
  cantInactivos = computed(() => this.clientesService.cantInactivos());
  cantConDeuda = computed(() => this.clientesService.cantConDeuda());
  cantIncobrables = computed(() => this.clientesService.cantIncobrables());

  constructor() {}

  ngOnInit() {
    this.clientesService.getCounters();
  }
}
