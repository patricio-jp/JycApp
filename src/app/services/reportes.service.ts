import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { take, catchError, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { InfoClienteMensual } from '../interfaces/reportes';
import { LoadingIndicatorService } from './loading-indicator.service';
import { NotificationsService } from './notifications.service';

@Injectable({
  providedIn: 'root',
})
export class ReportesService {
  constructor() {}

  private httpClient = inject(HttpClient);
  private loadingIndicator = inject(LoadingIndicatorService);
  private notificationsService = inject(NotificationsService);

  private apiEndpoint = `${environment.apiBaseUrl}/clientes/`;

  dataPlanillaMensual = signal<InfoClienteMensual[]>([]);

  loadingSignal = signal<boolean>(true);
  errorSignal = signal<string | null>(null);

  getPlanillaClientesMensual(month: number, year: number) {
    this.loadingIndicator.loadingOn();
    return this.httpClient
      .get<InfoClienteMensual[]>(`${this.apiEndpoint}planilla/mensual`, {
        params: { month, year },
      })
      .pipe(
        take(1),
        catchError((error) => {
          this.loadingIndicator.loadingOff();
          this.notificationsService.presentErrorToast(
            'Error al cargar la información de la planilla'
          );
          return of(null);
        })
      )
      .subscribe((data) => {
        this.loadingIndicator.loadingOff();
        if (data) {
          this.dataPlanillaMensual.set(data);
        } else {
          this.errorSignal.set(
            'No se pudo cargar la información de la planilla'
          );
        }
      });
  }
}
