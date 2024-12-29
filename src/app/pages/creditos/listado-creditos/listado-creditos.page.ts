import { Component, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonLoading,
  IonSearchbar,
  ModalController,
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { CreditosService } from 'src/app/services/creditos.service';
import {
  Credito,
  EstadoCredito,
  EstadoCuota,
  Periodo,
} from 'src/app/interfaces/credito';
import { addIcons } from 'ionicons';
import { informationCircleOutline } from 'ionicons/icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { CreditoInfoComponent } from '../detalle-credito/credito-info/credito-info.component';

@Component({
  selector: 'app-listado-creditos',
  templateUrl: './listado-creditos.page.html',
  styleUrls: ['./listado-creditos.page.scss'],
  standalone: true,
  imports: [
    IonSearchbar,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonLoading,
    CommonModule,
    FaIconComponent,
  ],
})
export class ListadoCreditosPage implements OnInit {
  constructor() {
    addIcons({ informationCircleOutline });
  }

  private creditosService = inject(CreditosService);

  private modalCtrl = inject(ModalController);

  private router = inject(Router);

  dataCreditos = computed(() => this.creditosService.dataCreditos());
  listadoCreditos = computed(() => this.creditosService.listadoCreditos());
  loadingSignal = computed(() => this.creditosService.loadingSignal());

  estadosCreditos = EstadoCredito;
  estadosCuota = EstadoCuota;
  periodos = Periodo;

  ngOnInit() {
    this.creditosService.getCreditos();
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
}
