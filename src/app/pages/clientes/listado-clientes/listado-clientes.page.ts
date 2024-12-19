import { Component, OnInit, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonLoading,
  IonSearchbar,
  IonButton,
  IonIcon,
  ModalController,
} from '@ionic/angular/standalone';
import { Cliente, EstadoCliente } from 'src/app/interfaces/cliente';
import { ClientesService } from 'src/app/services/clientes.service';
import { Router, RouterModule } from '@angular/router';
import { addIcons } from 'ionicons';
import { chevronUp } from 'ionicons/icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { ClienteInfoComponent } from '../detalle-cliente/cliente-info/cliente-info.component';

@Component({
  selector: 'app-listado-clientes',
  templateUrl: './listado-clientes.page.html',
  styleUrls: ['./listado-clientes.page.scss'],
  standalone: true,
  imports: [
    IonIcon,
    IonButton,
    IonSearchbar,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonLoading,
    FaIconComponent,
    CommonModule,
    RouterModule,
  ],
})
export class ListadoClientesPage implements OnInit {
  constructor() {
    addIcons({ chevronUp });
  }

  private clientesService = inject(ClientesService);
  private router = inject(Router);

  private modalCtrl = inject(ModalController);

  dataClientes = computed(() => this.clientesService.dataClientes());
  listadoClientes = computed(() => this.clientesService.listadoClientes());
  loadingSignal = computed(() => this.clientesService.loadingSignal());

  estadoClientes = EstadoCliente;

  ngOnInit() {
    this.clientesService.getClientes();
  }

  clienteDesktopDetails(id?: number) {
    this.router.navigate(['./dashboard/clientes/detalle/', id]);
  }

  async clienteDetails(id?: number) {
    const modal = await this.modalCtrl.create({
      component: ClienteInfoComponent,
      componentProps: { clienteID: id },
      breakpoints: [0.5, 1],
      initialBreakpoint: 0.5,
    });

    modal.present();

    const { data, role } = await modal.onWillDismiss();
  }
}
