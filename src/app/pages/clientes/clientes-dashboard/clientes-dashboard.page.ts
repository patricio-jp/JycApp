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
import { EstadoCliente } from 'src/app/interfaces/cliente';

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

  listadoClientes = computed(() => this.clientesService.listadoClientes());
  cantClientes = computed(() => this.listadoClientes().length);
  cantPendientes = computed(
    () =>
      this.listadoClientes().filter(
        (cliente) => cliente.estado === EstadoCliente.AConfirmar
      ).length
  );
  cantActivos = computed(
    () =>
      this.listadoClientes().filter(
        (cliente) => cliente.estado === EstadoCliente.Activo
      ).length
  );
  cantInactivos = computed(
    () =>
      this.listadoClientes().filter(
        (cliente) => cliente.estado === EstadoCliente.Inactivo
      ).length
  );
  cantConDeuda = computed(
    () =>
      this.listadoClientes().filter(
        (cliente) => cliente.estado === EstadoCliente.ConDeuda
      ).length
  );
  cantIncobrables = computed(
    () =>
      this.listadoClientes().filter(
        (cliente) => cliente.estado === EstadoCliente.Incobrable
      ).length
  );

  constructor() {}

  ngOnInit() {
    this.clientesService.getClientes();
  }
}
