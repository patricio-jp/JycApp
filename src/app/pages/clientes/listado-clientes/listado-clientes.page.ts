import {
  Component,
  OnDestroy,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonPopover,
  ModalController,
  ActionSheetController,
} from '@ionic/angular/standalone';
import {
  Cliente,
  ClientesFilter,
  EstadoCliente,
} from 'src/app/interfaces/cliente';
import { ClientesService } from 'src/app/services/clientes.service';
import { Router, RouterModule } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { ClienteInfoComponent } from '../detalle-cliente/cliente-info/cliente-info.component';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { NotificationsService } from 'src/app/services/notifications.service';
import { EditarClienteComponent } from '../editar-cliente/editar-cliente.component';
import { VentaInfoPage } from '../../ventas/detalle-venta/venta-info/venta-info.page';
import { Venta } from 'src/app/interfaces/operaciones';

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
    FaIconComponent,
    CommonModule,
    RouterModule,
    FormsModule,
  ],
})
export class ListadoClientesPage implements OnInit, OnDestroy {
  constructor() {}

  private clientesService = inject(ClientesService);
  private notificationsService = inject(NotificationsService);
  private router = inject(Router);
  private subscriptions = new Subscription();

  private modalCtrl = inject(ModalController);
  private actionSheetCtrl = inject(ActionSheetController);

  dataClientes = computed(() => this.clientesService.dataClientes());
  listadoClientes = computed(() => this.clientesService.listadoClientes());
  loadingSignal = computed(() => this.clientesService.loadingSignal());

  estadoClientes = EstadoCliente;

  actualPage = signal(1);
  pageSize: number = 10;
  totalPages = computed(() => {
    const totalVentas = this.dataClientes().count;
    return Math.ceil(totalVentas / this.pageSize);
  });
  arrayPages = computed(() => {
    const range = 3;
    const totalPages = this.totalPages();
    const currentPage = this.actualPage();

    const start = Math.max(1, currentPage - range);
    const end = Math.min(totalPages, currentPage + range);

    const pages = [];

    if (start > 1) {
      pages.push('...');
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages) {
      pages.push('...');
    }

    return pages;
  });
  itemsShowed = computed(() => {
    const start = (this.actualPage() - 1) * this.pageSize + 1;
    const end = Math.min(
      this.actualPage() * this.pageSize,
      this.dataClientes().count
    );
    return `${start} - ${end}`;
  });

  searchTerm?: string;
  domicilioFilter?: string;
  estadoFilter?: EstadoCliente;
  zonaFilter?: string;
  aparicionesFilter?: string;
  elminadosFilter?: boolean;

  filters: ClientesFilter = {};

  ngOnInit() {
    this.clientesService.getClientes(10, 1);
  }

  applyFiltersAndPagination() {
    this.clientesService.getClientes(
      this.pageSize,
      this.actualPage(),
      this.filters
    );
  }

  searchClientes(event: any) {
    this.filters.searchTerm = event.target.value;
    this.applyFilters();
  }

  nextPage() {
    if (this.actualPage() < this.totalPages()) {
      this.actualPage.set(this.actualPage() + 1);
      this.applyFiltersAndPagination();
    }
  }

  previousPage() {
    if (this.actualPage() > 1) {
      this.actualPage.set(this.actualPage() - 1);
      this.applyFiltersAndPagination();
    }
  }

  goToPage(page: number) {
    if (this.actualPage() !== page) {
      this.actualPage.set(page);
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
      mostrarEliminados: this.elminadosFilter ? true : undefined,
    };

    // Remove undefined values from filters
    this.filters = Object.fromEntries(
      Object.entries(this.filters).filter(
        ([_, v]) => v !== undefined && v !== '' && v !== 'undefined'
      )
    );
    console.log(this.filters);
    this.actualPage.set(1); // Reset to first page on new filter
    this.applyFiltersAndPagination();
  }

  clearFilters() {
    this.domicilioFilter = undefined;
    this.estadoFilter = undefined;
    this.zonaFilter = undefined;
    this.aparicionesFilter = undefined;
    this.elminadosFilter = undefined;
    this.filters = {};
    this.actualPage.set(1); // Reset to first page on clear filters
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

  async editarCliente(cliente: Cliente) {
    const modal = await this.modalCtrl.create({
      component: EditarClienteComponent,
      componentProps: { cliente },
      breakpoints: [0.5, 1],
      initialBreakpoint: 1,
    });

    modal.present();

    const { data, role } = await modal.onWillDismiss();
    console.log(data);
    if (role === 'confirm' && data) {
      this.subscriptions.add(
        this.clientesService
          .updateCliente(data.id, data)
          .subscribe(async (cliente) => {
            if (cliente) {
              this.notificationsService.presentSuccessToast(
                'Cliente actualizado correctamente'
              );
              this.clientesService.getClientes();
            }
          })
      );
    }
  }

  async deleteCliente(cliente: Cliente) {
    const sheet = await this.actionSheetCtrl.create({
      header: `Seguro desea eliminar el cliente ${cliente.apellido}, ${cliente.nombre}?`,
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
                this.notificationsService.presentSuccessToast(
                  'Cliente eliminado correctamente'
                );
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
                this.notificationsService.presentSuccessToast(
                  'Cliente eliminado definitivamente'
                );
                this.clientesService.getClientes();
              }
            })
        );
      }
    }
  }

  async restoreCliente(cliente: Cliente) {
    const sheet = await this.actionSheetCtrl.create({
      header: `Restablecer el cliente ${cliente.apellido}, ${cliente.nombre}?`,
      mode: 'ios',
      buttons: [
        {
          text: 'No',
          role: 'destructive',
          data: {
            action: 'cancel',
          },
        },
        {
          text: 'Si, restablecer',
          role: 'selected',
          data: {
            action: 'restore',
          },
        },
      ],
    });

    await sheet.present();

    const { data, role } = await sheet.onWillDismiss();
    console.log('data: ', data);
    console.log('role: ', role);
    if (role === 'selected' && data.action && cliente.id) {
      if (data.action === 'restore') {
        this.subscriptions.add(
          this.clientesService
            .restoreCliente(cliente.id)
            .subscribe(async (cliente) => {
              if (cliente) {
                this.notificationsService.presentSuccessToast(
                  'Cliente restablecido correctamente'
                );
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
