import { Component, computed, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonLoading,
  ModalController,
  ActionSheetController,
  ToastController,
  IonPopover,
  IonDatetimeButton,
  IonModal,
  IonDatetime,
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { CreditosService } from 'src/app/services/creditos.service';
import {
  Credito,
  CreditosFilter,
  EstadoCredito,
  EstadoCuota,
  Periodo,
} from 'src/app/interfaces/credito';
import { addIcons } from 'ionicons';
import { informationCircleOutline } from 'ionicons/icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { CreditoInfoComponent } from '../detalle-credito/credito-info/credito-info.component';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { EstadoCarton } from 'src/app/interfaces/carton';

@Component({
  selector: 'app-listado-creditos',
  templateUrl: './listado-creditos.page.html',
  styleUrls: ['./listado-creditos.page.scss'],
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
    IonLoading,
    CommonModule,
    FaIconComponent,
    FormsModule,
  ],
})
export class ListadoCreditosPage implements OnInit, OnDestroy {
  constructor() {
    addIcons({ informationCircleOutline });
  }

  private creditosService = inject(CreditosService);

  private modalCtrl = inject(ModalController);
  private actionSheetCtrl = inject(ActionSheetController);
  private toastCtrl = inject(ToastController);

  private router = inject(Router);
  private subscriptions = new Subscription();

  dataCreditos = computed(() => this.creditosService.dataCreditos());
  listadoCreditos = computed(() => this.creditosService.listadoCreditos());
  loadingSignal = computed(() => this.creditosService.loadingSignal());

  actualPage: number = 1;
  pageSize: number = 10;
  totalPages = computed(() => {
    const totalCreditos = this.dataCreditos().count;
    return Math.ceil(totalCreditos / this.pageSize);
  });
  arrayPages = computed(() => {
    return Array.from({ length: this.totalPages() }, (_, i) => i + 1);
  });
  itemsShowed = computed(() => {
    const start = (this.actualPage - 1) * this.pageSize + 1;
    const end = Math.min(
      this.actualPage * this.pageSize,
      this.dataCreditos().count
    );
    return `${start} - ${end}`;
  });

  estadosCreditos = EstadoCredito;
  estadosCuota = EstadoCuota;
  periodos = Periodo;
  estadosCarton = EstadoCarton;

  estadoCreditoFilter?: EstadoCredito;
  periodoFilter?: Periodo;
  estadoCartonFilter?: EstadoCarton;
  fechaVencCuotaFilter?: Date;
  fechaUltimoPagoFilter?: Date;
  searchTermFilter?: string;
  eliminadosFilter?: boolean;

  filters: CreditosFilter = {};

  ngOnInit() {
    this.creditosService.getCreditos();
  }

  applyFiltersAndPagination() {
    this.creditosService.getCreditos(
      this.pageSize,
      this.actualPage,
      this.filters
    );
  }

  searchCreditos(event: any) {
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
      estadoCredito: this.estadoCreditoFilter,
      periodo: this.periodoFilter,
      estadoCarton: this.estadoCartonFilter,
      fechaVencCuota: this.fechaVencCuotaFilter
        ? new Date(new Date(this.fechaVencCuotaFilter).setUTCHours(-3))
            .toISOString()
            .split('T')[0]
        : undefined,
      fechaUltimoPago: this.fechaUltimoPagoFilter
        ? new Date(new Date(this.fechaUltimoPagoFilter).setUTCHours(-3))
            .toISOString()
            .split('T')[0]
        : undefined,
      mostrarEliminados: this.eliminadosFilter ? true : undefined,
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
    this.estadoCreditoFilter = undefined;
    this.estadoCartonFilter = undefined;
    this.periodoFilter = undefined;
    this.fechaUltimoPagoFilter = undefined;
    this.fechaVencCuotaFilter = undefined;
    this.eliminadosFilter = false;
    this.filters = {};
    this.actualPage = 1; // Reset to first page on clear filters
    this.applyFiltersAndPagination();
  }

  async viewDetails(credito: Credito) {
    const modal = await this.modalCtrl.create({
      component: CreditoInfoComponent,
      componentProps: { credito },
      breakpoints: [0.25, 0.5, 1],
      initialBreakpoint: 0.25,
    });
    //console.log(credito);
    modal.present();

    const { data, role } = await modal.onWillDismiss();
    //console.log(data, role);
  }

  viewDesktopDetails(id?: number) {
    this.router.navigate(['./dashboard/creditos/detalle', id]);
  }

  cargarPagoACredito(credito: Credito) {
    this.router.navigate(['./dashboard/creditos/cargar-pago'], {
      state: { credito },
    });
  }

  async deleteCredito(credito: Credito) {
    const sheet = await this.actionSheetCtrl.create({
      header: `Seguro desea eliminar el crédito ${credito.venta.comprobante}?`,
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
    if (role === 'destructive' && data.action && credito.id) {
      if (data.action === 'soft-delete') {
        this.subscriptions.add(
          this.creditosService
            .deleteCredito(credito.id)
            .subscribe(async (credito) => {
              if (credito) {
                const toast = await this.toastCtrl.create({
                  position: 'top',
                  message: 'Credito eliminado correctamente',
                  duration: 3000,
                });
                await toast.present();
                this.creditosService.getCreditos();
              }
            })
        );
      } else if (data.action === 'delete') {
        this.subscriptions.add(
          this.creditosService
            .forceDeleteCredito(credito.id)
            .subscribe(async (credito) => {
              if (credito) {
                const toast = await this.toastCtrl.create({
                  position: 'top',
                  message: 'Credito eliminado correctamente',
                  duration: 3000,
                });
                await toast.present();
                this.creditosService.getCreditos();
              }
            })
        );
      }
    }
  }

  async restoreCredito(credito: Credito) {
    const sheet = await this.actionSheetCtrl.create({
      header: `Restablecer el crédito ${credito.venta.comprobante}?`,
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
    if (role === 'selected' && data.action && credito.id) {
      if (data.action === 'restore') {
        this.subscriptions.add(
          this.creditosService
            .restoreCredito(credito.id)
            .subscribe(async (credito) => {
              if (credito) {
                const toast = await this.toastCtrl.create({
                  position: 'top',
                  message: 'Credito restablecido correctamente',
                  duration: 3000,
                });
                await toast.present();
                this.creditosService.getCreditos();
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
