import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { catchError, Observable, of, take } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoadingIndicatorService } from './loading-indicator.service';
import { NotificationsService } from './notifications.service';
import {
  Rol,
  Usuario,
  UsuarioAPICounter,
  UsuarioAPIResponse,
  UsuariosFilter,
} from '../interfaces/usuario';

@Injectable({
  providedIn: 'root',
})
export class UsuariosService {
  constructor() {}

  private httpClient = inject(HttpClient);
  private loadingIndicator = inject(LoadingIndicatorService);
  private notificationsService = inject(NotificationsService);

  private apiEndpoint = `${environment.apiBaseUrl}/usuarios/`;

  dataUsuarios = signal<UsuarioAPIResponse>({
    count: 0,
    data: [],
  });
  listadoUsuarios = computed(() => this.dataUsuarios().data);

  cantUsuariosTotales = signal<number>(0);
  cantUsuariosAdmin = signal<number>(0);
  cantUsuariosSupervisores = signal<number>(0);
  cantUsuariosCobradores = signal<number>(0);
  cantUsuariosVendedores = signal<number>(0);

  getUsuarios(
    pageSize: number = 10,
    page: number = 1,
    filters?: UsuariosFilter
  ) {
    const params: any = { page, pageSize };
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        params[key] = value;
      });
    }
    this.loadingIndicator.loadingOn();
    this.httpClient
      .get<UsuarioAPIResponse>(this.apiEndpoint, { params })
      .pipe(
        take(1),
        catchError((error) => {
          this.loadingIndicator.loadingOff();
          this.notificationsService.presentErrorToast(
            'Error al cargar los usuarios'
          );
          return of({
            data: [],
            count: 0,
          });
        })
      )
      .subscribe((clientes) => {
        this.dataUsuarios.set({
          data: clientes.data,
          count: clientes.count,
        });
        //console.log(this.listadoClientes());
        this.loadingIndicator.loadingOff();
      });
  }

  getCounters(filters?: UsuariosFilter) {
    const params: any = { counterQuery: true };
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        params[key] = value;
      });
    }
    this.loadingIndicator.loadingOn();
    this.httpClient
      .get<UsuarioAPICounter>(this.apiEndpoint, { params })
      .pipe(
        take(1),
        catchError((error) => {
          this.loadingIndicator.loadingOff();
          this.notificationsService.presentErrorToast(
            'Error al cargar los usuarios'
          );
          return of([]);
        })
      )
      .subscribe((response) => {
        if (Array.isArray(response)) {
          return;
        }
        this.cantUsuariosTotales.set(response.count);
        response.data.forEach((counter) => {
          const estadoMap = {
            [Rol.Administrador]: this.cantUsuariosAdmin,
            [Rol.Supervisor]: this.cantUsuariosSupervisores,
            [Rol.Cobrador]: this.cantUsuariosCobradores,
            [Rol.Vendedor]: this.cantUsuariosVendedores,
          };

          const signal = estadoMap[counter.rol as Rol];
          if (signal) {
            signal.set(counter.count);
          }
        });
        this.loadingIndicator.loadingOff();
      });
  }

  getUsuario(id: number): Observable<Usuario> {
    return this.httpClient.get<Usuario>(this.apiEndpoint + id);
  }

  updateCliente(id: number, usuario: Usuario): Observable<Usuario> {
    return this.httpClient.put<Usuario>(this.apiEndpoint + id, usuario);
  }

  deleteUsuario(id: number) {
    return this.httpClient.delete(this.apiEndpoint + id);
  }

  forceDeleteUsuario(id: number) {
    return this.httpClient.delete(`${this.apiEndpoint + id}/force`);
  }

  restoreUsuario(id: number) {
    return this.httpClient.patch(`${this.apiEndpoint + id}/restore`, null);
  }
}
