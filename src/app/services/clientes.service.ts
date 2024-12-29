import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { catchError, Observable, of, take } from 'rxjs';
import {
  Cliente,
  ClienteAPIResponse,
  CreateClienteDTO,
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

  getClientes() {
    this.httpClient
      .get<ClienteAPIResponse>(this.apiEndpoint)
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
}
