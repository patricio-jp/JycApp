import { Component, computed, inject, Input } from '@angular/core';
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
import { CommonModule } from '@angular/common';
import { Cliente } from 'src/app/interfaces/cliente';
import { ClientesService } from 'src/app/services/clientes.service';

@Component({
  selector: 'app-cliente-selector',
  templateUrl: './cliente-selector.component.html',
  styleUrls: ['./cliente-selector.component.scss'],
  standalone: true,
  imports: [
    IonItem,
    IonList,
    IonSearchbar,
    IonLabel,
    CommonModule,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonContent,
    IonTitle,
  ],
})
export class ClienteSelectorComponent {
  @Input() cliente?: Cliente;

  private modalCtrl = inject(ModalController);
  private clientesService = inject(ClientesService);

  listadoClientes = computed(() => this.clientesService.listadoClientes());
  searchResults: Cliente[] = [];

  constructor() {
    this.clientesService.getClientes();
    this.searchResults = [...this.listadoClientes()];
  }

  onSearchChange($event: any) {
    //console.log($event.target.value);
    const query = $event.target.value.toLowerCase();
    this.searchResults = this.listadoClientes().filter(
      (cliente) =>
        cliente.dni.toString().toLowerCase().includes(query) ||
        cliente.apellido?.toLowerCase().includes(query) ||
        cliente.nombre.toLowerCase().includes(query)
    );
  }

  select(cliente: Cliente) {
    this.cliente = cliente;
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    return this.modalCtrl.dismiss(this.cliente, 'confirm');
  }
}
