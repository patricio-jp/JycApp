import { Component, computed, inject, Input, ViewChild } from '@angular/core';
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
import {
  Cliente,
  ClientesFilter,
  EstadoCliente,
} from 'src/app/interfaces/cliente';
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
  @ViewChild(IonContent) modalContent!: IonContent;

  private modalCtrl = inject(ModalController);
  private clientesService = inject(ClientesService);

  listadoClientes = computed(() => this.clientesService.listadoClientes());

  estadosCliente = EstadoCliente;

  constructor() {}

  searchCliente($event: any) {
    //console.log($event.target.value);
    const query = $event.target.value;
    const searchFilter: ClientesFilter = {
      searchTerm: query,
    };
    this.clientesService.getClientes(0, 0, searchFilter);
  }

  select(cliente: Cliente) {
    this.cliente = cliente;
    this.modalContent.scrollToTop();
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    return this.modalCtrl.dismiss(this.cliente, 'confirm');
  }
}
