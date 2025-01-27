import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import {
  CreateProductoDTO,
  Producto,
  ProductosAPIResponse,
  ProductosFilter,
} from '../interfaces/producto';
import { catchError, of, take, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { NotificationsService } from './notifications.service';
import { LoadingIndicatorService } from './loading-indicator.service';

@Injectable({
  providedIn: 'root',
})
export class ProductosService {
  constructor() {}

  private httpClient = inject(HttpClient);
  private loadingIndicator = inject(LoadingIndicatorService);
  private notificationsService = inject(NotificationsService);

  private apiEndpoint = `${environment.apiBaseUrl}/productos/`;

  dataProductos = signal({
    count: 0,
    data: [] as Producto[],
  });
  listadoProductos = computed(() => this.dataProductos().data);
  loadingSignal = signal<boolean>(true);

  errorSignal = signal<string | null>(null);

  getProductos(
    pageSize: number = 10,
    page: number = 1,
    filters?: ProductosFilter
  ) {
    const params: any = { page, pageSize };
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        params[key] = value;
      });
    }
    this.loadingIndicator.loadingOn();
    this.httpClient
      .get<ProductosAPIResponse>(this.apiEndpoint, { params })
      .pipe(
        take(1),
        catchError((error) => {
          this.loadingIndicator.loadingOff();
          this.notificationsService.presentErrorToast(
            'Error al cargar los productos'
          );
          return of({
            data: [],
            count: 0,
          });
        })
      )
      .subscribe((productos) => {
        this.dataProductos.set({
          data: productos.data,
          count: productos.count,
        });
        this.loadingIndicator.loadingOff();
        //console.log(this.dataProductos());
      });
  }

  getProducto(id: number) {
    return this.httpClient.get<Producto>(this.apiEndpoint + id);
  }

  createProducto(producto: CreateProductoDTO) {
    const response = this.httpClient.post<Producto>(this.apiEndpoint, producto);
    this.getProductos();
    return response;
  }

  updateProducto(id: number, producto: Producto) {
    return this.httpClient.put<Producto>(this.apiEndpoint + id, producto);
  }

  deleteProducto(id: number) {
    return this.httpClient.get<Producto>(this.apiEndpoint + id);
  }
}
