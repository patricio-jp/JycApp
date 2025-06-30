import {
  Component,
  OnDestroy,
  OnInit,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  ModalController,
  ActionSheetController,
} from '@ionic/angular/standalone';
import { Router, RouterModule } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { NotificationsService } from 'src/app/services/notifications.service';
import { ReportesService } from 'src/app/services/reportes.service';
import { Periodo } from 'src/app/interfaces/credito';
import { InfoClienteMensual } from 'src/app/interfaces/reportes';

@Component({
  selector: 'app-planilla-mensual',
  templateUrl: './planilla-mensual.page.html',
  styleUrls: ['./planilla-mensual.page.scss'],
  standalone: true,
  imports: [
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
export class PlanillaMensualPage implements OnInit, OnDestroy {
  constructor() {}

  private reportesService = inject(ReportesService);
  private notificationsService = inject(NotificationsService);
  private router = inject(Router);
  private subscriptions = new Subscription();

  private modalCtrl = inject(ModalController);
  private actionSheetCtrl = inject(ActionSheetController);

  tableData = computed(() => this.reportesService.dataPlanillaMensual());
  searchTerm = signal<string>('');
  filteredData = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (!term) return this.reportesService.dataPlanillaMensual();
    return this.reportesService
      .dataPlanillaMensual()
      .filter(
        (cliente) =>
          cliente.nombre?.toLowerCase().includes(term) ||
          cliente.apellido?.toLowerCase().includes(term) ||
          cliente.telefonos?.some((telefono) => telefono.includes(term)) ||
          cliente.domicilios?.some(
            (domicilio) =>
              domicilio.direccion?.toLowerCase().includes(term) ||
              domicilio.barrio?.toLowerCase().includes(term) ||
              domicilio.localidad?.toLowerCase().includes(term)
          ) ||
          cliente.creditos?.some((credito) =>
            credito.comprobante?.toString().includes(term)
          )
      );
  });

  periodos = Periodo;

  ngOnInit() {
    const now = new Date();
    const month = now.getMonth() + 1; // getMonth() is zero-based
    const year = now.getFullYear();
    this.reportesService.getPlanillaClientesMensual(month, year);
  }

  searchClientes(event: any) {
    this.searchTerm.set(event.target.value);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
