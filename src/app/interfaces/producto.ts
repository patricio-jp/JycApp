import { Costo, Precio } from './precios';

export interface Talle {
  id?: number;
  talle: string;
}

export interface Marca {
  id?: number;
  nombre: string;
}

export interface Modelo {
  id?: number;
  nombre: string;
  id_marca: number;
  marca?: Marca;
}

export interface Color {
  id?: number;
  color: string;
}

export interface Producto {
  id?: number;
  id_modelo: number;
  modelo?: Modelo;
  id_color: number;
  color?: Color;
  id_talle: number;
  talle?: Talle;
  costos: Costo[];
  precios: Precio[];
  id_inventario: number;
  inventario?: Inventario;
}

export interface Inventario {
  id?: number;
  id_producto: number;
  producto?: Producto;
  stock: number;
}
