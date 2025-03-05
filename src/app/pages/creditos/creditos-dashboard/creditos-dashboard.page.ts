import { Component, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { CreditosService } from 'src/app/services/creditos.service';

@Component({
  selector: 'app-creditos-dashboard',
  templateUrl: './creditos-dashboard.page.html',
  styleUrls: ['./creditos-dashboard.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
  ],
})
export class CreditosDashboardPage implements OnInit {
  private creditosService = inject(CreditosService);

  cantCreditosTotales = computed(() =>
    this.creditosService.cantCreditosTotales()
  );
  cantCreditosPendientes = computed(() =>
    this.creditosService.cantCreditosPendientes()
  );
  cantCreditosActivos = computed(() =>
    this.creditosService.cantCreditosActivos()
  );
  cantCreditosPagados = computed(() =>
    this.creditosService.cantCreditosPagados()
  );
  cantCreditosEnDeuda = computed(() =>
    this.creditosService.cantCreditosEnDeuda()
  );
  cantCreditosAnulados = computed(() =>
    this.creditosService.cantCreditosAnulados()
  );

  cantCreditosSemanales = computed(() =>
    this.creditosService.cantCreditosActivosSemanales()
  );
  cantCreditosQuincenales = computed(() =>
    this.creditosService.cantCreditosActivosQuincenales()
  );
  cantCreditosMensuales = computed(() =>
    this.creditosService.cantCreditosActivosMensuales()
  );

  cantCartonesPendientes = computed(() =>
    this.creditosService.cantCartonesPendientes()
  );
  cantCartonesListos = computed(() =>
    this.creditosService.cantCartonesListos()
  );
  cantCartonesEnDudas = computed(() =>
    this.creditosService.cantCartonesEnDudas()
  );
  cantCartonesLlevados = computed(() =>
    this.creditosService.cantCartonesLlevados()
  );
  cantCartonesSeparados = computed(() =>
    this.creditosService.cantCartonesSeparados()
  );
  cantCartonesFinalizados = computed(() =>
    this.creditosService.cantCartonesFinalizados()
  );

  ngOnInit() {
    this.creditosService.getCounters();
  }
}
