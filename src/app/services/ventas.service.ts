import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import {
  CondicionOperacion,
  CreateVentaDTO,
  EstadoOperacion,
  Venta,
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

  cantVentasTotales = computed(() => this.listadoVentas().length);

  cantVentasPendientes = computed(
    () =>
      this.listadoVentas().filter(
        (venta) => venta.estado === EstadoOperacion.Pendiente
      ).length
  );
  cantVentasParaEntrega = computed(
    () =>
      this.listadoVentas().filter(
        (venta) => venta.estado === EstadoOperacion.ParaEntregar
      ).length
  );
  cantVentasPagadas = computed(
    () =>
      this.listadoVentas().filter(
        (venta) => venta.estado === EstadoOperacion.Pagado
      ).length
  );
  cantVentasEntregadas = computed(
    () =>
      this.listadoVentas().filter(
        (venta) => venta.estado === EstadoOperacion.Entregado
      ).length
  );
  cantVentasAnuladas = computed(
    () =>
      this.listadoVentas().filter(
        (venta) => venta.estado === EstadoOperacion.Anulado
      ).length
  );

  cantVentasACredito = computed(
    () =>
      this.listadoVentas().filter(
        (venta) => venta.condicion === CondicionOperacion.CTA_CTE
      ).length
  );
  cantVentasAlContado = computed(
    () =>
      this.listadoVentas().filter(
        (venta) => venta.condicion === CondicionOperacion.CONTADO
      ).length
  );

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
