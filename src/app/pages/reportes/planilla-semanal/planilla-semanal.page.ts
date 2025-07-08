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
import {
  InfoDiaCreditoSemanal,
  InfoClienteMensual,
} from 'src/app/interfaces/reportes';

@Component({
  selector: 'app-planilla-semanal',
  templateUrl: './planilla-semanal.page.html',
  styleUrls: ['./planilla-semanal.page.scss'],
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
export class PlanillaSemanalPage implements OnInit, OnDestroy {
  constructor() {}

  private reportesService = inject(ReportesService);
  private notificationsService = inject(NotificationsService);
  private router = inject(Router);
  private subscriptions = new Subscription();

  private modalCtrl = inject(ModalController);
  private actionSheetCtrl = inject(ActionSheetController);

  searchTerm = signal<string>('');

  diasSemana = [
    'Domingo',
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
  ];

  // Computed para obtener los días presentes en la respuesta (en orden de diasSemana)
  diasConDatos = computed(() => {
    const data = this.reportesService.dataPlanillaSemanal();
    return this.diasSemana.filter((dia) => data[dia] && data[dia].length > 0);
  });

  // Computed para filtrar por búsqueda en cada día
  datosFiltradosPorDia = computed(() => {
    const data = this.reportesService.dataPlanillaSemanal();
    const term = this.searchTerm().toLowerCase();
    const resultado: { [dia: string]: InfoDiaCreditoSemanal[] } = {};
    for (const dia of this.diasSemana) {
      if (!data[dia]) continue;
      resultado[dia] = !term
        ? data[dia]
        : data[dia].filter(
            (item) =>
              item.cliente.nombre?.toLowerCase().includes(term) ||
              item.cliente.apellido?.toLowerCase().includes(term) ||
              item.cliente.telefonos?.some((tel) => tel.includes(term)) ||
              item.cliente.domicilios?.some(
                (dom) =>
                  dom.direccion?.toLowerCase().includes(term) ||
                  dom.barrio?.toLowerCase().includes(term) ||
                  dom.localidad?.toLowerCase().includes(term)
              ) ||
              item.credito.comprobante?.toString().includes(term)
          );
    }
    return resultado;
  });

  selectedDate: string = '';

  ngOnInit() {
    const now = new Date();
    this.selectedDate = now.toISOString().slice(0, 10);
    this.fetchSemanaFromDate(this.selectedDate);
  }

  onDateChange(event: any) {
    const value = event.target.value;
    this.selectedDate = value;
    this.fetchSemanaFromDate(value);
  }

  fetchSemanaFromDate(dateStr: string) {
    const date = new Date(dateStr);
    // Calcular domingo (primer día de la semana)
    const day = date.getDay(); // 0 = domingo
    const sunday = new Date(date);
    sunday.setDate(date.getDate() - day);
    sunday.setHours(0, 0, 0, 0);
    const saturday = new Date(sunday);
    saturday.setDate(sunday.getDate() + 6);
    saturday.setHours(23, 59, 59, 999);
    this.reportesService.getPlanillaClientesSemanal(sunday, saturday);
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
            <title>Planilla Semanal</title>
            ${styles}
            ${landscapeStyle}
          </head>
          <body class="relative overflow-y-auto mx-auto" onload="window.print();window.close()">
            ${printContent.innerHTML}
          </body>
        </html>
      `);
      popup.document.close();
    }
  }

  getTotalDia(dia: string): number {
    const items = this.datosFiltradosPorDia()[dia] || [];
    let total = 0;
    for (const item of items) {
      // Solo una cuota por item
      total += item.credito.montoCuota || 0;
    }
    return total;
  }

  /**
   * Devuelve la fecha (DIA/MES) correspondiente a cada día de la semana seleccionada.
   */
  getFechaDiaSemana(dia: string): string {
    // Calcular el domingo de la semana seleccionada
    const date = new Date(this.selectedDate);
    const day = date.getDay(); // 0 = domingo
    const sunday = new Date(date);
    sunday.setDate(date.getDate() - day);
    // Índice del día en diasSemana (0=Domingo, 1=Lunes,...)
    const idx = this.diasSemana.indexOf(dia);
    if (idx === -1) return '';
    const fecha = new Date(sunday);
    fecha.setDate(sunday.getDate() + idx);
    const diaNum = fecha.getDate().toString().padStart(2, '0');
    const mesNum = (fecha.getMonth() + 1).toString().padStart(2, '0');
    return `${diaNum}/${mesNum}`;
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
