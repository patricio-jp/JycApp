import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import {
  CreateVentaDTO,
  Venta,
  VentasAPIResponse,
} from '../interfaces/operaciones';
import { catchError, count, of } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class VentasService {
  constructor() {}

  private httpClient = inject(HttpClient);

  private apiEndpoint = `${environment.apiBaseUrl}/ventas/`;

  dataVentas = signal({
    count: 0,
    data: [] as Venta[],
  });
  listadoVentas = computed(() => this.dataVentas().data);
  loadingSignal = signal<boolean>(true);

  errorSignal = signal<string | null>(null);

  getVentas() {
    this.httpClient
      .get<VentasAPIResponse>(this.apiEndpoint)
      .pipe(
        catchError((error) => {
          this.errorSignal.set('Error al cargar las ventas');
          this.loadingSignal.set(false);
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
        this.loadingSignal.set(false);
        this.errorSignal.set(null);
        console.log(this.dataVentas());
      });
  }

  getVenta(id: number) {
    return this.httpClient.get<Venta>(this.apiEndpoint + id);
  }

  createVenta(venta: CreateVentaDTO) {
    const response = this.httpClient.post<Venta>(this.apiEndpoint, venta);
    this.getVentas();
    return response;
  }

  deleteVenta(id: number) {
    return this.httpClient.delete(this.apiEndpoint + id);
  }
}
