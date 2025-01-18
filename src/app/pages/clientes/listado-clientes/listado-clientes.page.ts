import { Component, OnDestroy, OnInit, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonLoading,
  IonPopover,
  ModalController,
  ActionSheetController,
  ToastController,
} from '@ionic/angular/standalone';
import {
  Cliente,
  ClientesFilter,
  EstadoCliente,
} from 'src/app/interfaces/cliente';
import { ClientesService } from 'src/app/services/clientes.service';
import { Router, RouterModule } from '@angular/router';
import { addIcons } from 'ionicons';
import { chevronUp } from 'ionicons/icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { ClienteInfoComponent } from '../detalle-cliente/cliente-info/cliente-info.component';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-listado-clientes',
  templateUrl: './listado-clientes.page.html',
  styleUrls: ['./listado-clientes.page.scss'],
  standalone: true,
  imports: [
    IonPopover,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonLoading,
    FaIconComponent,
    CommonModule,
    RouterModule,
    FormsModule,
  ],
})
export class ListadoClientesPage implements OnInit, OnDestroy {
  constructor() {
    addIcons({ chevronUp });
  }

  private clientesService = inject(ClientesService);
  private router = inject(Router);
  private subscriptions = new Subscription();

  private modalCtrl = inject(ModalController);
  private actionSheetCtrl = inject(ActionSheetController);
  private toastCtrl = inject(ToastController);

  dataClientes = computed(() => this.clientesService.dataClientes());
  listadoClientes = computed(() => this.clientesService.listadoClientes());
  loadingSignal = computed(() => this.clientesService.loadingSignal());

  estadoClientes = EstadoCliente;

  actualPage: number = 1;
  pageSize: number = 10;
  totalPages = computed(() => {
    const totalVentas = this.dataClientes().count;
    return Math.ceil(totalVentas / this.pageSize);
  });
  arrayPages = computed(() => {
    return Array.from({ length: this.totalPages() }, (_, i) => i + 1);
  });
  itemsShowed = computed(() => {
    const start = (this.actualPage - 1) * this.pageSize + 1;
    const end = Math.min(
      this.actualPage * this.pageSize,
      this.dataClientes().count
    );
    return `${start} - ${end}`;
  });

  searchTerm?: string;
  domicilioFilter?: string;
  estadoFilter?: EstadoCliente;
  zonaFilter?: string;
  aparicionesFilter?: string;
  cantCreditosActivosFilter?: number;

  filters: ClientesFilter = {};

  ngOnInit() {
    this.clientesService.getClientes(10, 1);
  }

  applyFiltersAndPagination() {
    this.clientesService.getClientes(
      this.pageSize,
      this.actualPage,
      this.filters
    );
  }

  searchClientes(event: any) {
    this.filters.searchTerm = event.target.value;
    this.applyFilters();
  }

  nextPage() {
    if (this.actualPage !== this.totalPages()) {
      this.actualPage++;
      this.applyFiltersAndPagination();
    }
  }

  previousPage() {
    if (this.actualPage > 1) {
      this.actualPage--;
      this.applyFiltersAndPagination();
    }
  }

  goToPage(page: number) {
    if (this.actualPage !== page) {
      this.actualPage = page;
      this.applyFiltersAndPagination();
    }
  }

  applyFilters() {
    this.filters = {
      ...this.filters,
      domicilio: this.domicilioFilter,
      estado: this.estadoFilter,
      zona: this.zonaFilter,
      apariciones: this.aparicionesFilter,
      cantCreditosActivos: this.cantCreditosActivosFilter,
    };

    // Remove undefined values from filters
    this.filters = Object.fromEntries(
      Object.entries(this.filters).filter(
        ([_, v]) => v !== undefined && v !== '' && v !== 'undefined'
      )
    );
    console.log(this.filters);
    this.actualPage = 1; // Reset to first page on new filter
    this.applyFiltersAndPagination();
  }

  clearFilters() {
    this.domicilioFilter = undefined;
    this.estadoFilter = undefined;
    this.zonaFilter = undefined;
    this.aparicionesFilter = undefined;
    this.cantCreditosActivosFilter = undefined;
    this.filters = {};
    this.actualPage = 1; // Reset to first page on clear filters
    this.applyFiltersAndPagination();
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

  async deleteCliente(cliente: Cliente) {
    const sheet = await this.actionSheetCtrl.create({
      header: `Seguro desea eliminar el cliente ${cliente.apellido}, ${cliente.nombre}?`,
      mode: 'ios',
      buttons: [
        {
          text: 'Si, eliminar',
          role: 'destructive',
          data: {
            action: 'soft-delete',
          },
        },
        {
          text: 'Si, eliminar definitivamente',
          role: 'destructive',
          data: {
            action: 'delete',
          },
        },
        {
          text: 'No, cancelar',
          role: 'cancel',
          data: {
            action: 'cancel',
          },
        },
      ],
    });

    await sheet.present();

    const { data, role } = await sheet.onWillDismiss();
    console.log('data: ', data);
    console.log('role: ', role);
    if (role === 'destructive' && data.action && cliente.id) {
      if (data.action === 'soft-delete') {
        this.subscriptions.add(
          this.clientesService
            .deleteCliente(cliente.id)
            .subscribe(async (cliente) => {
              if (cliente) {
                const toast = await this.toastCtrl.create({
                  position: 'top',
                  message: 'Cliente eliminado correctamente',
                  duration: 3000,
                });
                await toast.present();
                this.clientesService.getClientes();
              }
            })
        );
      } else if (data.action === 'delete') {
        this.subscriptions.add(
          this.clientesService
            .forceDeleteCliente(cliente.id)
            .subscribe(async (cliente) => {
              if (cliente) {
                const toast = await this.toastCtrl.create({
                  position: 'top',
                  message: 'Cliente eliminado correctamente',
                  duration: 3000,
                });
                await toast.present();
                this.clientesService.getClientes();
              }
            })
        );
      }
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
