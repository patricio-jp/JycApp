import { HttpClient, HttpContext } from '@angular/common/http';
import {
  Injectable,
  WritableSignal,
  computed,
  inject,
  signal,
} from '@angular/core';
import { catchError, Observable, of, take } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoadingIndicatorService } from './loading-indicator.service';
import { NotificationsService } from './notifications.service';
import {
  CreateIngresoDTO,
  FormaPago,
  Ingreso,
  IngresoAPICounter,
  IngresoAPIResponse,
  IngresosFilter,
  Recibo,
} from '../interfaces/ingreso';
import { IS_PUBLIC } from '../interceptors/jwt.interceptor';

@Injectable({
  providedIn: 'root',
})
export class IngresosService {
  constructor() {}

  private httpClient = inject(HttpClient);
  private loadingIndicator = inject(LoadingIndicatorService);
  private notificationsService = inject(NotificationsService);

  private apiEndpoint = `${environment.apiBaseUrl}/ingresos/`;

  dataIngresos = signal<IngresoAPIResponse>({
    count: 0,
    data: [],
  });
  listadoIngresos = computed(() => this.dataIngresos().data);

  cantIngresosTotales = signal<number>(0);
  cantIngresosActivos = signal<number>(0);
  cantIngresosEliminados = signal<number>(0);
  cantIngresosEnEfectivo = signal<number>(0);
  cantIngresosConTransferencia = signal<number>(0);

  cantIngresosEsteMes = signal<number>(0);
  ingresosEsteMesMonto = signal<number>(0);
  cantIngresosUltimoMes = signal<number>(0);
  ingresosUltimoMesMonto = signal<number>(0);

  getIngresos(
    pageSize: number = 10,
    page: number = 1,
    filters?: IngresosFilter
  ) {
    const params: any = { page, pageSize };
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        params[key] = value;
      });
    }
    this.loadingIndicator.loadingOn();
    this.httpClient
      .get<IngresoAPIResponse>(this.apiEndpoint, { params })
      .pipe(
        take(1),
        catchError((error) => {
          this.loadingIndicator.loadingOff();
          this.notificationsService.presentErrorToast(
            'Error al cargar los ingresos'
          );
          return of({
            data: [],
            count: 0,
          });
        })
      )
      .subscribe((ingresos) => {
        this.dataIngresos.set({
          data: ingresos.data,
          count: ingresos.count,
        });
        this.loadingIndicator.loadingOff();
      });
  }

  getCounters(filters?: IngresosFilter) {
    const params: any = { counterQuery: true };
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        params[key] = value;
      });
    }
    this.loadingIndicator.loadingOn();
    this.httpClient
      .get<IngresoAPICounter>(this.apiEndpoint, { params })
      .pipe(
        take(1),
        catchError((error) => {
          this.loadingIndicator.loadingOff();
          this.notificationsService.presentErrorToast(
            'Error al cargar los ingresos'
          );
          return of([]);
        })
      )
      .subscribe((response) => {
        if (Array.isArray(response)) {
          return;
        }
        this.cantIngresosTotales.set(response.count);
        response.data.forEach((counter) => {
          const formaPagoMap = {
            [FormaPago.Efectivo]: this.cantIngresosEnEfectivo,
            [FormaPago.Transferencia]: this.cantIngresosConTransferencia,
          };

          const eliminadosMap: Record<
            'true' | 'false',
            WritableSignal<number>
          > = {
            true: this.cantIngresosEliminados,
            false: this.cantIngresosActivos,
          };

          formaPagoMap[counter.formaPago as FormaPago]?.set(counter.count);
          eliminadosMap[counter.eliminado.toString() as 'true' | 'false']?.set(
            counter.count
          );
        });
        this.loadingIndicator.loadingOff();
      });
  }

  getDataUltimoMes() {
    const esteMes = new Date();
    const params: any = {
      fecha: esteMes.toISOString(),
    };
    this.loadingIndicator.loadingOn();
    this.httpClient
      .get<IngresoAPIResponse>(this.apiEndpoint, { params })
      .pipe(
        take(1),
        catchError((error) => {
          this.loadingIndicator.loadingOff();
          this.notificationsService.presentErrorToast(
            'Error al cargar los ingresos'
          );
          return of({
            data: [],
            count: 0,
          });
        })
      )
      .subscribe((ingresos) => {
        let montoTotal = 0;
        ingresos.data.forEach((ingreso) => {
          montoTotal = montoTotal + Number(ingreso.importe);
        });
        this.cantIngresosEsteMes.set(ingresos.count);
        this.ingresosEsteMesMonto.set(montoTotal);
        this.loadingIndicator.loadingOff();
      });

    const ultimoMes = new Date(esteMes.getFullYear(), esteMes.getMonth() - 1);
    const paramsUltMes: any = {
      fecha: ultimoMes.toISOString(),
    };
    this.loadingIndicator.loadingOn();
    this.httpClient
      .get<IngresoAPIResponse>(this.apiEndpoint, { params: paramsUltMes })
      .pipe(
        take(1),
        catchError((error) => {
          this.loadingIndicator.loadingOff();
          this.notificationsService.presentErrorToast(
            'Error al cargar los ingresos'
          );
          return of({
            data: [],
            count: 0,
          });
        })
      )
      .subscribe((ingresos) => {
        let montoTotal = 0;
        ingresos.data.forEach((ingreso) => {
          montoTotal = montoTotal + Number(ingreso.importe);
        });
        this.cantIngresosUltimoMes.set(ingresos.count);
        this.ingresosUltimoMesMonto.set(montoTotal);
        this.loadingIndicator.loadingOff();
      });
  }

  getIngresoByID(id: number): Observable<Ingreso> {
    return this.httpClient.get<Ingreso>(this.apiEndpoint + id);
  }

  getReciboByUUID(uuid: string): Observable<Recibo> {
    //console.log('Get recibo by UUID:', uuid);
    //this.loadingIndicator.loadingOn();
    return this.httpClient
      .get<Recibo>(this.apiEndpoint + 'uuid/' + uuid, {
        context: new HttpContext().set(IS_PUBLIC, true),
      })
      .pipe(
        take(1),
        catchError((error) => {
          this.loadingIndicator.loadingOff();
          throw error;
        })
      );
  }

  updateIngreso(id: number, ingresoDto: CreateIngresoDTO) {
    return this.httpClient.patch<Ingreso>(this.apiEndpoint + id, ingresoDto);
  }

  deleteIngreso(id: number) {
    return this.httpClient.delete(this.apiEndpoint + id);
  }

  forceDeleteIngreso(id: number) {
    return this.httpClient.delete(`${this.apiEndpoint + id}/force`);
  }

  restoreIngreso(id: number) {
    return this.httpClient.patch(`${this.apiEndpoint + id}/restore`, null);
  }
}
