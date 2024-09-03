import { Costo, Precio } from './precios';

export interface Producto {
  id: number;
  codigo: string;
  nombre: string;
  costos: Costo[];
  precios: Precio[];
  stock: number;
}

export interface CreateProductoDTO {
  codigo: string;
  nombre: string;
  costos?: Costo[];
  precios?: Precio[];
  stock?: number;
}

export interface ProductosAPIResponse {
  data: Producto[];
  count: number;
}
