import { computed, inject, Injectable, signal } from '@angular/core';
import {
  CargarPagoDTO,
  CreateCreditoDTO,
  Credito,
  CreditoAPIResponse,
} from '../interfaces/credito';
import { HttpClient } from '@angular/common/http';
import { catchError, of, Observable, take } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CreditosService {
  constructor() {}

  private httpClient = inject(HttpClient);

  private apiEndpoint = `${environment.apiBaseUrl}/creditos/`;

  dataCreditos = signal<CreditoAPIResponse>({
    count: 0,
    data: [],
  });
  listadoCreditos = computed(() => this.dataCreditos().data);
  loadingSignal = signal<boolean>(true);

  errorSignal = signal<string | null>(null);

  getCreditos() {
    this.httpClient
      .get<CreditoAPIResponse>(this.apiEndpoint)
      .pipe(
        take(1),
        catchError((error) => {
          this.errorSignal.set('Error al cargar los créditos');
          this.loadingSignal.set(false);
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
        this.loadingSignal.set(false);
        this.errorSignal.set(null);
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
}
