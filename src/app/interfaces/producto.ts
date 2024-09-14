import { Injectable } from '@angular/core';
import { Costo, CreateCostoDTO, CreatePrecioDTO, Precio } from './precios';
import { Mapper } from './mapper';

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
  costos?: CreateCostoDTO[];
  precios?: CreatePrecioDTO[];
  stock?: number;
}

export interface ProductosAPIResponse {
  data: Producto[];
  count: number;
}

export interface ProductoAPI {
  id: number;
  codigo: string;
  nombre: string;
  costos: Costo[];
  precios: Precio[];
}

export interface Inventario {
  id?: number;
  stock: number;
  id_producto?: number;
}

/* @Injectable({
  providedIn: 'root',
})
export class ProductoMapper extends Mapper<ProductoAPI, Producto> {
  protected map(entity: ProductoAPI): Producto {
    console.log(entity);
    return {
      ...entity,
      stock: 2,
    };
  }
} */
