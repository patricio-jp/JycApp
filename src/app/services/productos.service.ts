import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import {
  CreateProductoDTO,
  Producto,
  ProductosAPIResponse,
} from '../interfaces/producto';
import { catchError, of, take, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductosService {
  constructor() {}

  private httpClient = inject(HttpClient);

  private apiEndpoint = `${environment.apiBaseUrl}/productos/`;

  dataProductos = signal({
    count: 0,
    data: [] as Producto[],
  });
  listadoProductos = computed(() => this.dataProductos().data);
  loadingSignal = signal<boolean>(true);

  errorSignal = signal<string | null>(null);

  getProductos() {
    this.httpClient
      .get<ProductosAPIResponse>(this.apiEndpoint)
      .pipe(
        take(1),
        catchError((error) => {
          this.errorSignal.set('Error al cargar los productos');
          this.loadingSignal.set(false);
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
        this.loadingSignal.set(false);
        this.errorSignal.set(null);
        console.log(this.dataProductos());
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
