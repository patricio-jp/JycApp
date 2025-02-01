import { computed, inject, Injectable, signal } from '@angular/core';
import {
  CargarPagoDTO,
  CreateCreditoDTO,
  Credito,
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

  cantCreditosTotales = computed(() => this.listadoCreditos().length);

  cantCreditosPendientes = computed(
    () =>
      this.listadoCreditos().filter(
        (credito) => credito.estado === EstadoCredito.Pendiente
      ).length
  );
  cantCreditosActivos = computed(
    () =>
      this.listadoCreditos().filter(
        (credito) => credito.estado === EstadoCredito.Activo
      ).length
  );
  cantCreditosPagados = computed(
    () =>
      this.listadoCreditos().filter(
        (credito) => credito.estado === EstadoCredito.Pagado
      ).length
  );
  cantCreditosEnDeuda = computed(
    () =>
      this.listadoCreditos().filter(
        (credito) => credito.estado === EstadoCredito.EnDeuda
      ).length
  );
  cantCreditosAnulados = computed(
    () =>
      this.listadoCreditos().filter(
        (credito) => credito.estado === EstadoCredito.Anulado
      ).length
  );

  cantCreditosActivosSemanales = computed(
    () =>
      this.listadoCreditos().filter(
        (credito) =>
          credito.estado !== EstadoCredito.Anulado &&
          credito.estado !== EstadoCredito.Pagado &&
          credito.periodo === Periodo.Semanal
      ).length
  );
  cantCreditosActivosQuincenales = computed(
    () =>
      this.listadoCreditos().filter(
        (credito) =>
          credito.estado !== EstadoCredito.Anulado &&
          credito.estado !== EstadoCredito.Pagado &&
          credito.periodo === Periodo.Quincenal
      ).length
  );
  cantCreditosActivosMensuales = computed(
    () =>
      this.listadoCreditos().filter(
        (credito) =>
          credito.estado !== EstadoCredito.Anulado &&
          credito.estado !== EstadoCredito.Pagado &&
          credito.periodo === Periodo.Mensual
      ).length
  );

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

  cargarPago(pago: CargarPagoDTO) {
    const { creditoId } = pago;
    return this.httpClient.patch(
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
