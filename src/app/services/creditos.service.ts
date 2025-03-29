import { computed, inject, Injectable, signal } from '@angular/core';
import {
  CargarPagoDTO,
  CreateCreditoDTO,
  Credito,
  CreditoAPICounter,
  CreditoAPIResponse,
  CreditosFilter,
  EstadoCredito,
  Periodo,
} from '../interfaces/credito';
import { HttpClient } from '@angular/common/http';
import { catchError, of, Observable, take } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoadingIndicatorService } from './loading-indicator.service';
import { NotificationsService } from './notifications.service';
import { CambiarEstadoCartonDTO, EstadoCarton } from '../interfaces/carton';
import { Ingreso } from '../interfaces/ingreso';

@Injectable({
  providedIn: 'root',
})
export class CreditosService {
  constructor() {}

  private httpClient = inject(HttpClient);
  private loadingIndicator = inject(LoadingIndicatorService);
  private notificationsService = inject(NotificationsService);

  private apiEndpoint = `${environment.apiBaseUrl}/creditos/`;

  dataCreditos = signal<CreditoAPIResponse>({
    count: 0,
    data: [],
  });
  listadoCreditos = computed(() => this.dataCreditos().data);
  loadingSignal = signal<boolean>(true);

  errorSignal = signal<string | null>(null);

  cantCreditosTotales = signal<number>(0);

  cantCreditosPendientes = signal<number>(0);
  cantCreditosActivos = signal<number>(0);
  cantCreditosPagados = signal<number>(0);
  cantCreditosEnDeuda = signal<number>(0);
  cantCreditosAnulados = signal<number>(0);

  cantCreditosActivosSemanales = signal<number>(0);
  cantCreditosActivosQuincenales = signal<number>(0);
  cantCreditosActivosMensuales = signal<number>(0);

  cantCartonesPendientes = signal<number>(0);
  cantCartonesListos = signal<number>(0);
  cantCartonesEnDudas = signal<number>(0);
  cantCartonesLlevados = signal<number>(0);
  cantCartonesSeparados = signal<number>(0);
  cantCartonesFinalizados = signal<number>(0);

  getCreditos(
    pageSize: number = 10,
    page: number = 1,
    filters?: CreditosFilter
  ) {
    const params: any = { page, pageSize };
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        params[key] = value;
      });
    }
    //console.log(params);
    this.loadingIndicator.loadingOn();
    this.httpClient
      .get<CreditoAPIResponse>(this.apiEndpoint, { params })
      .pipe(
        take(1),
        catchError((error) => {
          this.loadingIndicator.loadingOff();
          this.notificationsService.presentErrorToast(
            'Error al cargar los créditos'
          );
          return of({
            data: [],
            count: 0,
          });
        })
      )
      .subscribe((creditos) => {
        this.dataCreditos.set({
          data: creditos.data,
          count: creditos.count,
        });
        this.loadingIndicator.loadingOff();
        this.errorSignal.set(null);
        //console.log(creditos);
      });
  }

  getCounters(filters?: CreditosFilter) {
    const params: any = { counterQuery: true };
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        params[key] = value;
      });
    }
    this.loadingIndicator.loadingOn();
    this.httpClient
      .get<CreditoAPICounter>(this.apiEndpoint, { params })
      .pipe(
        take(1),
        catchError((error) => {
          this.loadingIndicator.loadingOff();
          this.notificationsService.presentErrorToast(
            'Error al cargar los créditos'
          );
          return of([]);
        })
      )
      .subscribe((response) => {
        if (Array.isArray(response)) {
          return;
        }
        this.cantCreditosTotales.set(response.count);
        response.data.forEach((counter) => {
          const estadoCreditoMap = {
            [EstadoCredito.Pendiente]: this.cantCreditosPendientes,
            [EstadoCredito.Activo]: this.cantCreditosActivos,
            [EstadoCredito.EnDeuda]: this.cantCreditosEnDeuda,
            [EstadoCredito.Pagado]: this.cantCreditosPagados,
            [EstadoCredito.Anulado]: this.cantCreditosAnulados,
          };

          const periodoMap = {
            [Periodo.Mensual]: this.cantCreditosActivosMensuales,
            [Periodo.Quincenal]: this.cantCreditosActivosQuincenales,
            [Periodo.Semanal]: this.cantCreditosActivosSemanales,
          };

          const estadoCartonMap = {
            [EstadoCarton.Pendiente]: this.cantCartonesPendientes,
            [EstadoCarton.EnDudas]: this.cantCartonesEnDudas,
            [EstadoCarton.Listo]: this.cantCartonesListos,
            [EstadoCarton.Separado]: this.cantCartonesSeparados,
            [EstadoCarton.Llevado]: this.cantCartonesLlevados,
            [EstadoCarton.Finalizado]: this.cantCartonesFinalizados,
          };

          estadoCreditoMap[counter.estadoCredito]?.set(counter.count);
          periodoMap[counter.periodo]?.set(counter.count);
          estadoCartonMap[counter.estadoCarton]?.set(counter.count);
        });
        this.loadingIndicator.loadingOff();
      });
  }

  getCredito(id: number): Observable<Credito> {
    return this.httpClient.get<Credito>(this.apiEndpoint + id);
  }

  createCredito(credito: CreateCreditoDTO): Observable<Credito> {
    return this.httpClient.post<Credito>(this.apiEndpoint, credito);
  }

  updateCredito(id: number, credito: Credito): Observable<Credito> {
    return this.httpClient.put<Credito>(this.apiEndpoint + id, credito);
  }

  updateCartonStatus(idCredito: number, estado: CambiarEstadoCartonDTO) {
    return this.httpClient.patch(
      `${this.apiEndpoint + idCredito}/estadoCarton`,
      estado
    );
  }

  cargarPago(pago: CargarPagoDTO): Observable<Ingreso> {
    const { creditoId } = pago;
    return this.httpClient.patch<Ingreso>(
      `${this.apiEndpoint + creditoId}/cargar-pago`,
      pago
    );
  }

  deleteCredito(id: number) {
    return this.httpClient.delete(this.apiEndpoint + id);
  }

  forceDeleteCredito(id: number) {
    return this.httpClient.delete(`${this.apiEndpoint + id}/force`);
  }

  restoreCredito(id: number) {
    return this.httpClient.patch(`${this.apiEndpoint + id}/restore`, null);
  }
}
