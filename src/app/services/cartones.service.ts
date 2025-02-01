import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { LoadingIndicatorService } from './loading-indicator.service';
import { NotificationsService } from './notifications.service';
import { environment } from 'src/environments/environment';
import {
  CambiarEstadoCartonDTO,
  CartonAPIResponse,
  CartonesFilter,
  CreateGrupoCartonesDTO,
  GrupoCartones,
  GrupoCartonesAPIResponse,
} from '../interfaces/carton';
import { catchError, Observable, of, take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartonesService {
  constructor() {}

  private httpClient = inject(HttpClient);
  private loadingIndicator = inject(LoadingIndicatorService);
  private notificationsService = inject(NotificationsService);

  private apiEndpointCartones = `${environment.apiBaseUrl}/cartones/`;
  private apiEndpointGruposCartones = `${environment.apiBaseUrl}/cartones/grupos/`;

  dataCartones = signal<CartonAPIResponse>({
    count: 0,
    data: [],
  });
  listadoCartones = computed(() => this.dataCartones().data);
  loadingSignal = signal<boolean>(true);

  errorSignal = signal<string | null>(null);

  cantCartonesTotales = computed(() => this.listadoCartones().length);

  dataGrupoCartones = signal<GrupoCartonesAPIResponse>({
    count: 0,
    data: [],
  });
  listadoGrupoCartones = computed(() => this.dataGrupoCartones().data);

  cantGruposCartonesTotales = computed(
    () => this.listadoGrupoCartones().length
  );

  getCartones(
    pageSize: number = 10,
    page: number = 1,
    filters?: CartonesFilter
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
      .get<CartonAPIResponse>(this.apiEndpointCartones, { params })
      .pipe(
        take(1),
        catchError((error) => {
          this.loadingIndicator.loadingOff();
          this.notificationsService.presentErrorToast(
            'Error al cargar los cartones'
          );
          return of({
            data: [],
            count: 0,
          });
        })
      )
      .subscribe((cartones) => {
        this.dataCartones.set({
          data: cartones.data,
          count: cartones.count,
        });
        this.loadingIndicator.loadingOff();
        this.errorSignal.set(null);
        //console.log(creditos);
      });
  }

  getGruposCartones(
    pageSize: number = 10,
    page: number = 1,
    filters?: CartonesFilter
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
      .get<GrupoCartonesAPIResponse>(this.apiEndpointGruposCartones, { params })
      .pipe(
        take(1),
        catchError((error) => {
          this.loadingIndicator.loadingOff();
          this.notificationsService.presentErrorToast(
            'Error al cargar los grupos de cartones'
          );
          return of({
            data: [],
            count: 0,
          });
        })
      )
      .subscribe((grupos) => {
        this.dataGrupoCartones.set({
          data: grupos.data,
          count: grupos.count,
        });
        this.loadingIndicator.loadingOff();
        this.errorSignal.set(null);
        //console.log(creditos);
      });
  }

  createGrupoCartones(
    nuevoGrupo: CreateGrupoCartonesDTO
  ): Observable<GrupoCartones> {
    return this.httpClient.post<GrupoCartones>(
      this.apiEndpointGruposCartones,
      nuevoGrupo
    );
  }

  updateGrupoCartones(
    id: number,
    grupo: CreateGrupoCartonesDTO
  ): Observable<GrupoCartones> {
    return this.httpClient.put<GrupoCartones>(
      this.apiEndpointGruposCartones + id,
      grupo
    );
  }

  asignarCartonAGrupo(idCarton: number, idGrupo: number) {
    return this.httpClient.patch(
      `${this.apiEndpointCartones + idCarton}/agregarAGrupo/${idGrupo}`,
      null
    );
  }

  eliminarCartonDeGrupo(idCarton: number) {
    return this.httpClient.patch(
      `${this.apiEndpointCartones + idCarton}/eliminarDeGrupo`,
      null
    );
  }

  updateCartonStatus(id: number, estado: CambiarEstadoCartonDTO) {
    return this.httpClient.patch(
      `${this.apiEndpointCartones + id}/estadoCarton`,
      estado
    );
  }

  deleteCarton(id: number) {
    return this.httpClient.delete(this.apiEndpointCartones + id);
  }

  deleteGrupoCartones(id: number) {
    return this.httpClient.delete(this.apiEndpointGruposCartones + id);
  }

  restoreCarton(id: number) {
    return this.httpClient.patch(
      `${this.apiEndpointCartones + id}/restore`,
      null
    );
  }

  restoreGrupoCartones(id: number) {
    return this.httpClient.patch(
      `${this.apiEndpointGruposCartones + id}/restore`,
      null
    );
  }
}
