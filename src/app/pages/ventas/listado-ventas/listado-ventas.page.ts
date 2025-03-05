import {
  Component,
  computed,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  ModalController,
  IonPopover,
  IonDatetimeButton,
  IonModal,
  IonDatetime,
  ActionSheetController,
} from '@ionic/angular/standalone';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { VentasService } from 'src/app/services/ventas.service';
import { Cliente } from 'src/app/interfaces/cliente';
import {
  CondicionOperacion,
  EstadoOperacion,
  Venta,
  VentasFilter,
} from 'src/app/interfaces/operaciones';
import { VentaInfoPage } from '../detalle-venta/venta-info/venta-info.page';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { NotificationsService } from 'src/app/services/notifications.service';
import { ClienteInfoComponent } from '../../clientes/detalle-cliente/cliente-info/cliente-info.component';

@Component({
  selector: 'app-listado-ventas',
  templateUrl: './listado-ventas.page.html',
  styleUrls: ['./listado-ventas.page.scss'],
  standalone: true,
  imports: [
    IonDatetime,
    IonModal,
    IonDatetimeButton,
    IonPopover,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    RouterLink,
    FaIconComponent,
    FormsModule,
  ],
})
export class ListadoVentasPage implements OnInit, OnDestroy {
  constructor() {}

  private ventasService = inject(VentasService);
  private notificationsService = inject(NotificationsService);

  private modalCtrl = inject(ModalController);
  private actionSheetCtrl = inject(ActionSheetController);

  private router = inject(Router);
  private subscriptions = new Subscription();

  estadosVenta = EstadoOperacion;

  dataVentas = computed(() => this.ventasService.dataVentas());
  listadoVentas = computed(() => this.ventasService.listadoVentas());
  loadingSignal = computed(() => this.ventasService.loadingSignal());

  actualPage = signal(1);
  pageSize: number = 10;
  totalPages = computed(() => {
    const totalVentas = this.dataVentas().count;
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
      this.dataVentas().count
    );
    return `${start} - ${end}`;
  });

  clienteFilter?: string;
  dateFilter?: any;
  estadoFilter?: EstadoOperacion;
  condicionFilter?: CondicionOperacion;
  productoFilter?: string;
  eliminadosFilter?: boolean;

  filters: VentasFilter = {};

  ngOnInit() {
    this.ventasService.getVentas(10, 1);
  }

  applyFiltersAndPagination() {
    this.ventasService.getVentas(
      this.pageSize,
      this.actualPage(),
      this.filters
    );
  }

  searchVentas(event: any) {
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
      cliente: this.clienteFilter,
      fecha: this.dateFilter,
      estado: this.estadoFilter,
      condicion: this.condicionFilter,
      productos: this.productoFilter,
      mostrarEliminados: this.eliminadosFilter ? true : undefined,
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
    this.clienteFilter = undefined;
    this.dateFilter = undefined;
    this.estadoFilter = undefined;
    this.condicionFilter = undefined;
    this.productoFilter = undefined;
    this.eliminadosFilter = false;
    this.filters = {};
    this.actualPage.set(1); // Reset to first page on clear filters
    this.applyFiltersAndPagination();
  }

  async clienteDetails(id?: number) {
    const modal = await this.modalCtrl.create({
      component: ClienteInfoComponent,
      componentProps: { clienteID: id },
      breakpoints: [0.5, 1],
      initialBreakpoint: 1,
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

  ventaDesktopDetails(id?: number) {
    this.router.navigate(['./dashboard/ventas/detalle', id]);
  }

  async deleteVenta(venta: Venta) {
    const sheet = await this.actionSheetCtrl.create({
      header: `Seguro desea eliminar la venta ${venta.comprobante}?`,
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
    if (role === 'destructive' && data.action && venta.id) {
      if (data.action === 'soft-delete') {
        this.subscriptions.add(
          this.ventasService.deleteVenta(venta.id).subscribe(async (venta) => {
            if (venta) {
              this.notificationsService.presentSuccessToast(
                'Venta eliminada correctamente'
              );
              this.ventasService.getVentas();
            }
          })
        );
      } else if (data.action === 'delete') {
        this.subscriptions.add(
          this.ventasService
            .forceDeleteVenta(venta.id)
            .subscribe(async (venta) => {
              if (venta) {
                this.notificationsService.presentSuccessToast(
                  'Venta eliminada correctamente'
                );
                this.ventasService.getVentas();
              }
            })
        );
      }
    }
  }

  async restoreVenta(venta: Venta) {
    const sheet = await this.actionSheetCtrl.create({
      header: `Restablecer la venta ${venta.comprobante}?`,
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
    if (role === 'selected' && data.action && venta.id) {
      if (data.action === 'restore') {
        this.subscriptions.add(
          this.ventasService.restoreVenta(venta.id).subscribe(async (venta) => {
            if (venta) {
              this.notificationsService.presentSuccessToast(
                'Venta restablecida correctamente'
              );
              this.ventasService.getVentas();
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
