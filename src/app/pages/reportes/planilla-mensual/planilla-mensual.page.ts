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

  print() {
    const printContent = document.getElementById('planillaMensual');
    if (!printContent) return;

    // Obtener el nombre dinámico del archivo CSS de Angular
    const styles = Array.from(document.head.getElementsByTagName('link'))
      .filter(
        (link) => link.rel === 'stylesheet' && link.href.includes('styles')
      )
      .map((link) => `<link rel="stylesheet" href="${link.href}">`)
      .join('');

    // CSS para impresión en horizontal
    const landscapeStyle = `
      <style>
        @media print {
          @page {
            size: A4 landscape;
            margin: 5mm;
          }
          body {
            margin: 0;
            padding: 0;
          }
          table {
            width: 100% !important;
            font-size: 11px !important;
          }
          th, td {
            padding: 4px !important;
            word-break: break-word !important;
            overflow-wrap: break-word !important;
          }
          th {
            text-align: center !important;
            word-break: no-break !important;
          }
          th:first-child, td:first-child {
            width: 35px !important;
            min-width: 30px !important;
            max-width: 40px !important;
            text-align: center !important;
          }
          th:last-child, td:last-child {
            min-width: 90px !important;
            text-align: right !important;
          }
          /* Opcional: escala si sigue desbordando */
          .print-scale {
            transform: scale(0.95);
            transform-origin: top left;
            width: 105%;
          }
        }
      </style>
    `;

    const popup = window.open('', '_blank', 'width=800, height=600');
    if (popup) {
      popup.document.open();
      popup.document.write(`
        <html class="hydrated">
          <head>
            <title>Planilla Mensual</title>
            ${styles}
            ${landscapeStyle}
          </head>
          <body class="relative overflow-y-auto max-w-[297mm] mx-auto" onload="window.print();window.close()">
            ${printContent.innerHTML}
          </body>
        </html>
      `);
      popup.document.close();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
