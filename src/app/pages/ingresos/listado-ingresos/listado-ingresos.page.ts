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
  IonModal,
  ModalController,
  ActionSheetController,
  IonDatetimeButton,
} from '@ionic/angular/standalone';

import { Router, RouterModule } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { NotificationsService } from 'src/app/services/notifications.service';
import { IngresosService } from 'src/app/services/ingresos.service';
import { FormaPago, Ingreso, IngresosFilter } from 'src/app/interfaces/ingreso';
import { ClienteInfoComponent } from '../../clientes/detalle-cliente/cliente-info/cliente-info.component';
import { VerReciboComponent } from '../ver-recibo/ver-recibo.component';

@Component({
  selector: 'app-listado-ingresos',
  templateUrl: './listado-ingresos.page.html',
  styleUrls: ['./listado-ingresos.page.scss'],
  standalone: true,
  imports: [
    IonDatetimeButton,
    IonModal,
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
export class ListadoIngresosPage implements OnInit, OnDestroy {
  constructor() {}

  private ingresosService = inject(IngresosService);
  private notificationsService = inject(NotificationsService);
  private router = inject(Router);
  private subscriptions = new Subscription();

  private modalCtrl = inject(ModalController);
  private actionSheetCtrl = inject(ActionSheetController);

  dataIngresos = computed(() => this.ingresosService.dataIngresos());
  listadoIngresos = computed(() => this.ingresosService.listadoIngresos());

  actualPage = signal(1);
  pageSize: number = 10;
  totalPages = computed(() => {
    const ingresosTotales = this.dataIngresos().count;
    return Math.ceil(ingresosTotales / this.pageSize);
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
      this.dataIngresos().count
    );
    return `${start} - ${end}`;
  });

  formasPago = FormaPago;

  searchTerm?: string;
  dateFilter?: Date;
  clienteFilter?: string;
  formaPagoFilter?: FormaPago;
  elminadosFilter?: boolean;

  filters: IngresosFilter = {};

  ngOnInit() {
    this.ingresosService.getIngresos(10, 1);
  }

  applyFiltersAndPagination() {
    this.ingresosService.getIngresos(
      this.pageSize,
      this.actualPage(),
      this.filters
    );
  }

  searchIngresos(event: any) {
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
      formaPago: this.formaPagoFilter,
      fecha: this.dateFilter,
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
    this.clienteFilter = undefined;
    this.formaPagoFilter = undefined;
    this.dateFilter = undefined;
    this.elminadosFilter = undefined;
    this.filters = {};
    this.actualPage.set(1); // Reset to first page on clear filters
    this.applyFiltersAndPagination();
  }

  async ingresoDetails(ingreso: Ingreso) {
    const modal = await this.modalCtrl.create({
      component: VerReciboComponent,
      componentProps: {
        recibo: {
          ...ingreso.recibo,
          ingreso: ingreso,
        },
      },
      breakpoints: [0.5, 1],
      initialBreakpoint: 1,
    });

    modal.present();

    const { data, role } = await modal.onWillDismiss();
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

  async deleteIngreso(ingreso: Ingreso) {
    const sheet = await this.actionSheetCtrl.create({
      header: `Seguro desea eliminar el ingreso ${ingreso.recibo.uuid}?`,
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
    if (role === 'destructive' && data.action && ingreso.id) {
      if (data.action === 'soft-delete') {
        this.subscriptions.add(
          this.ingresosService
            .deleteIngreso(ingreso.id)
            .subscribe(async (ingreso) => {
              if (ingreso) {
                this.notificationsService.presentSuccessToast(
                  'Ingreso eliminado correctamente'
                );
                this.ingresosService.getIngresos();
              }
            })
        );
      } else if (data.action === 'delete') {
        this.subscriptions.add(
          this.ingresosService
            .forceDeleteIngreso(ingreso.id)
            .subscribe(async (ingreso) => {
              if (ingreso) {
                this.notificationsService.presentSuccessToast(
                  'Ingreso eliminado definitivamente'
                );
                this.ingresosService.getIngresos();
              }
            })
        );
      }
    }
  }

  async restoreIngreso(ingreso: Ingreso) {
    const sheet = await this.actionSheetCtrl.create({
      header: `Restablecer el ingreso ${ingreso.recibo.uuid}?`,
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
    if (role === 'selected' && data.action && ingreso.id) {
      if (data.action === 'restore') {
        this.subscriptions.add(
          this.ingresosService
            .restoreIngreso(ingreso.id)
            .subscribe(async (ingreso) => {
              if (ingreso) {
                this.notificationsService.presentSuccessToast(
                  'Ingreso restablecido correctamente'
                );
                this.ingresosService.getIngresos();
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
