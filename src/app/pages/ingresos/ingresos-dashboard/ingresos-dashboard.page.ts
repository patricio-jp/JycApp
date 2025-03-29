import { Component, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { IngresosService } from 'src/app/services/ingresos.service';

@Component({
  selector: 'app-ingresos-dashboard',
  templateUrl: './ingresos-dashboard.page.html',
  styleUrls: ['./ingresos-dashboard.page.scss'],
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
export class IngresosDashboardPage implements OnInit {
  private ingresosService = inject(IngresosService);

  cantIngresosEsteMes = computed(() =>
    this.ingresosService.cantIngresosEsteMes()
  );
  ingresosEsteMesMonto = computed(() =>
    this.ingresosService.ingresosEsteMesMonto()
  );
  cantIngresosUltimoMes = computed(() =>
    this.ingresosService.cantIngresosUltimoMes()
  );
  ingresosUltimoMesMonto = computed(() =>
    this.ingresosService.ingresosUltimoMesMonto()
  );

  constructor() {}

  ngOnInit() {
    this.ingresosService.getDataUltimoMes();
  }
}
