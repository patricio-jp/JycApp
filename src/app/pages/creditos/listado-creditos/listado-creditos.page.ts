import {
  Component,
  computed,
  effect,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
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
import {
  CambiarEstadoCartonDTO,
  EstadoCarton,
} from 'src/app/interfaces/carton';
import { EstadoCartonComponent } from '../estado-carton/estado-carton.component';
import { NotificationsService } from 'src/app/services/notifications.service';
import { CartonesService } from 'src/app/services/cartones.service';
import { GrupoCartonComponent } from '../grupo-carton/grupo-carton.component';

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
    CommonModule,
    FaIconComponent,
    FormsModule,
  ],
})
export class ListadoCreditosPage implements OnInit, OnDestroy {
  constructor() {
    addIcons({ informationCircleOutline });

    effect(() => {
      this.loadingSignal();
    });
  }

  private creditosService = inject(CreditosService);
  private cartonesService = inject(CartonesService);
  private notificationsService = inject(NotificationsService);

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
                this.notificationsService.presentSuccessToast(
                  'Crédito eliminado correctamente'
                );
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
                this.notificationsService.presentSuccessToast(
                  'Crédito eliminado correctamente'
                );
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
                this.notificationsService.presentSuccessToast(
                  'Crédito restablecido correctamente'
                );
                this.creditosService.getCreditos();
              }
            })
        );
      }
    }
  }

  async gestionCarton(credito: Credito) {
    let sheetButtons = [];
    let buttonGrupo = {
      text: 'Asignar cartón a grupo',
      role: 'selected',
      data: {
        action: 'asignarAGrupo',
      },
    };

    if (credito.carton.grupoCartones) {
      sheetButtons.push({
        text: 'Mostrar info del grupo de cartones',
        role: 'selected',
        data: {
          action: 'mostrarGrupo',
        },
      });
      buttonGrupo.text = 'Eliminar cartón del grupo';
      buttonGrupo.role = 'destructive';
      buttonGrupo.data.action = 'eliminarDeGrupo';
    }
    sheetButtons.push(buttonGrupo);

    const sheet = await this.actionSheetCtrl.create({
      header: `Acciones sobre el cartón del crédito ${credito.venta.comprobante}`,
      mode: 'ios',
      buttons: [
        {
          text: 'Cambiar estado del cartón',
          role: 'selected',
          data: {
            action: 'cambiarEstado',
          },
        },
        ...sheetButtons,
      ],
    });

    await sheet.present();

    const { data, role } = await sheet.onWillDismiss();
    console.log('data: ', data, role);

    if (role === 'destructive' && data.action === 'eliminarDeGrupo') {
      this.grupoCarton(credito, 'eliminarDeGrupo');
    } else if (role === 'selected') {
      if (data.action === 'asignarAGrupo' || data.action === 'mostrarGrupo') {
        this.grupoCarton(credito, data.action);
      } else if (data.action === 'cambiarEstado') {
        this.actualizarEstadoCarton(credito);
      }
    }
  }

  async actualizarEstadoCarton(credito: Credito) {
    const modal = await this.modalCtrl.create({
      component: EstadoCartonComponent,
      componentProps: { credito },
      breakpoints: [0.5, 1],
      initialBreakpoint: 1,
    });

    modal.present();

    const { data, role } = await modal.onWillDismiss();
    console.log(data, role);
    if (role === 'confirm' && data) {
      const estado: CambiarEstadoCartonDTO = {
        estado: Number(data.estado),
        fechaCarton: data.fechaCarton
          ? data.fechaCarton
          : new Date().toISOString().split('T')[0],
        actualizarGrupo: data.actualizarGrupo,
      };
      this.subscriptions.add(
        this.creditosService
          .updateCartonStatus(credito.id, estado)
          .subscribe(() => {
            this.notificationsService.presentSuccessToast(
              'Estado del/los cartón/es actualizado/s correctamente'
            );
            this.applyFiltersAndPagination();
          })
      );
    }
  }

  async grupoCarton(
    credito: Credito,
    action: 'mostrarGrupo' | 'asignarAGrupo' | 'eliminarDeGrupo'
  ) {
    if (action === 'eliminarDeGrupo') {
      const sheet = await this.actionSheetCtrl.create({
        header: `Seguro desea eliminar el cartón del grupo?`,
        buttons: [
          {
            text: 'Si, eliminar',
            role: 'destructive',
          },
          {
            text: 'No, cancelar',
            role: 'cancel',
          },
        ],
      });

      await sheet.present();

      const { data, role } = await sheet.onWillDismiss();
      if (role === 'destructive') {
        this.subscriptions.add(
          this.cartonesService
            .eliminarCartonDeGrupo(credito.carton.id)
            .subscribe(() => {
              this.notificationsService.presentSuccessToast(
                'Cartón eliminado del grupo correctamente'
              );
              this.applyFiltersAndPagination();
            })
        );
      }
    } else {
      const modal = await this.modalCtrl.create({
        component: GrupoCartonComponent,
        componentProps: { credito, action },
        breakpoints: [0.5, 1],
        initialBreakpoint: 1,
      });

      modal.present();

      const { data, role } = await modal.onWillDismiss();
      console.log(data, role);
      if (role === 'confirm' && data) {
        const { idCarton, idGrupo } = data;
        this.subscriptions.add(
          this.cartonesService
            .asignarCartonAGrupo(idCarton, idGrupo)
            .subscribe(() => {
              this.notificationsService.presentSuccessToast(
                'Cartón añadido al grupo correctamente'
              );
              this.applyFiltersAndPagination();
            })
        );
      }
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
