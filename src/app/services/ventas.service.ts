import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import {
  CondicionOperacion,
  CreateVentaDTO,
  EstadoOperacion,
  Venta,
  VentaAPICounter,
  VentasAPIResponse,
  VentasFilter,
} from '../interfaces/operaciones';
import { catchError, of, take } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LocalFile } from '../interfaces/files';
import { FileService } from './files.service';
import { LoadingIndicatorService } from './loading-indicator.service';
import { NotificationsService } from './notifications.service';

@Injectable({
  providedIn: 'root',
})
export class VentasService {
  constructor() {}

  private httpClient = inject(HttpClient);
  private fileService = inject(FileService);
  private loadingIndicator = inject(LoadingIndicatorService);
  private notificationsService = inject(NotificationsService);

  private apiEndpoint = `${environment.apiBaseUrl}/ventas`;

  dataVentas = signal({
    count: 0,
    data: [] as Venta[],
  });
  listadoVentas = computed(() => this.dataVentas().data);
  loadingSignal = signal<boolean>(true);

  errorSignal = signal<string | null>(null);

  cantVentasTotales = signal<number>(0);

  cantVentasPendientes = signal<number>(0);
  cantVentasParaEntrega = signal<number>(0);
  cantVentasPagadas = signal<number>(0);
  cantVentasEntregadas = signal<number>(0);
  cantVentasAnuladas = signal<number>(0);

  cantVentasACredito = signal<number>(0);
  cantVentasAlContado = signal<number>(0);

  getVentas(pageSize: number = 10, page: number = 1, filters?: VentasFilter) {
    /* let filter = '';
    if (filters) {
      filter = Object.entries(filters)
        .map(([key, value]) => {
          if (typeof value === 'number') {
            return `${key}=${value}`;
          } else {
            return `${key}='${value}'`;
          }
        })
        .join('&');
    } */
    const params: any = { page, pageSize };
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        params[key] = value;
      });
    }
    //const params = { filter, page, pageSize };
    //console.log(params);
    this.loadingIndicator.loadingOn();
    this.httpClient
      .get<VentasAPIResponse>(this.apiEndpoint, { params })
      .pipe(
        take(1),
        catchError((error) => {
          this.loadingIndicator.loadingOff();
          this.notificationsService.presentErrorToast(
            'Error al cargar las ventas'
          );
          return of({
            data: [],
            count: 0,
          });
        })
      )
      .subscribe((ventas) => {
        this.dataVentas.set({
          data: ventas.data,
          count: ventas.count,
        });
        this.loadingIndicator.loadingOff();
        //console.log(this.dataVentas());
      });
  }

  getCounters(filters?: VentasFilter) {
    const params: any = { counterQuery: true };
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        params[key] = value;
      });
    }
    this.loadingIndicator.loadingOn();
    this.httpClient
      .get<VentaAPICounter>(this.apiEndpoint, { params })
      .pipe(
        take(1),
        catchError((error) => {
          this.loadingIndicator.loadingOff();
          this.notificationsService.presentErrorToast(
            'Error al cargar las ventas'
          );
          return of([]);
        })
      )
      .subscribe((response) => {
        if (Array.isArray(response)) {
          return;
        }
        this.cantVentasTotales.set(response.count);
        response.data.forEach((counter) => {
          const estadoMap = {
            [EstadoOperacion.Pendiente]: this.cantVentasPendientes,
            [EstadoOperacion.ParaEntregar]: this.cantVentasParaEntrega,
            [EstadoOperacion.Entregado]: this.cantVentasEntregadas,
            [EstadoOperacion.Pagado]: this.cantVentasPagadas,
            [EstadoOperacion.Anulado]: this.cantVentasAnuladas,
          };

          const condicionMap = {
            [CondicionOperacion.CONTADO]: this.cantVentasAlContado,
            [CondicionOperacion.CTA_CTE]: this.cantVentasACredito,
          };

          if (estadoMap[counter.estado as EstadoOperacion]) {
            estadoMap[Number(counter.estado) as EstadoOperacion].set(
              counter.count
            );
          }

          if (condicionMap[counter.condicion]) {
            condicionMap[counter.condicion].set(counter.count);
          }
        });
        this.loadingIndicator.loadingOff();
      });
  }

  getVenta(id: number) {
    return this.httpClient.get<Venta>(`${this.apiEndpoint}/${id}`);
  }

  async createVenta(venta: CreateVentaDTO, comprobante?: LocalFile) {
    const formData = new FormData();
    formData.append('data', JSON.stringify(venta));
    //console.log('Data:', formData.get('data'));
    if (comprobante) {
      const blob = await this.fileService.convertFileToBlob(comprobante);
      formData.append('file', blob, comprobante.name);
      //console.log('File:', formData.get('file'));
    }
    const response = this.httpClient.post<Venta>(this.apiEndpoint, formData);
    return response;
  }

  deleteVenta(id: number) {
    return this.httpClient.delete(this.apiEndpoint + id);
  }

  forceDeleteVenta(id: number) {
    return this.httpClient.delete(`${this.apiEndpoint}/${id}/force`);
  }

  restoreVenta(id: number) {
    return this.httpClient.patch(`${this.apiEndpoint}/${id}/restore`, null);
  }
}
