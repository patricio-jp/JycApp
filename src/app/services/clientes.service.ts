import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { catchError, Observable, of, take } from 'rxjs';
import {
  Cliente,
  ClienteAPIResponse,
  ClientesFilter,
  CreateClienteDTO,
  EstadoCliente,
} from '../interfaces/cliente';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ClientesService {
  constructor() {}

  private httpClient = inject(HttpClient);

  private apiEndpoint = `${environment.apiBaseUrl}/clientes/`;

  dataClientes = signal<ClienteAPIResponse>({
    count: 0,
    data: [],
  });
  listadoClientes = computed(() => this.dataClientes().data);
  loadingSignal = signal<boolean>(true);

  errorSignal = signal<string | null>(null);

  cantClientesTotales = computed(() => this.listadoClientes().length);

  cantPendientes = computed(
    () =>
      this.listadoClientes().filter(
        (cliente) => cliente.estado === EstadoCliente.AConfirmar
      ).length
  );
  cantActivos = computed(
    () =>
      this.listadoClientes().filter(
        (cliente) => cliente.estado === EstadoCliente.Activo
      ).length
  );
  cantInactivos = computed(
    () =>
      this.listadoClientes().filter(
        (cliente) => cliente.estado === EstadoCliente.Inactivo
      ).length
  );
  cantConDeuda = computed(
    () =>
      this.listadoClientes().filter(
        (cliente) => cliente.estado === EstadoCliente.ConDeuda
      ).length
  );
  cantIncobrables = computed(
    () =>
      this.listadoClientes().filter(
        (cliente) => cliente.estado === EstadoCliente.Incobrable
      ).length
  );

  getClientes(
    pageSize: number = 10,
    page: number = 1,
    filters?: ClientesFilter
  ) {
    const params: any = { page, pageSize };
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        params[key] = value;
      });
    }
    this.httpClient
      .get<ClienteAPIResponse>(this.apiEndpoint, { params })
      .pipe(
        take(1),
        catchError((error) => {
          this.errorSignal.set('Error al cargar los clientes');
          this.loadingSignal.set(false);
          return of({
            data: [],
            count: 0,
          });
        })
      )
      .subscribe((clientes) => {
        this.dataClientes.set({
          data: clientes.data,
          count: clientes.count,
        });
        console.log(this.listadoClientes());
        this.loadingSignal.set(false);
        this.errorSignal.set(null);
      });
  }

  getCliente(id: number): Observable<Cliente> {
    return this.httpClient.get<Cliente>(this.apiEndpoint + id);
  }

  createCliente(cliente: CreateClienteDTO): Observable<Cliente> {
    return this.httpClient.post<Cliente>(this.apiEndpoint, cliente);
  }

  updateCliente(id: number, cliente: Cliente): Observable<Cliente> {
    return this.httpClient.put<Cliente>(this.apiEndpoint + id, cliente);
  }

  deleteCliente(id: number) {
    return this.httpClient.delete(this.apiEndpoint + id);
  }

  forceDeleteCliente(id: number) {
    return this.httpClient.delete(`${this.apiEndpoint + id}/force`);
  }

  restoreCliente(id: number) {
    return this.httpClient.patch(`${this.apiEndpoint + id}/restore`, null);
  }
}
