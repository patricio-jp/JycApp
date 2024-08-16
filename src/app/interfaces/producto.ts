import { Costo, Precio } from './precios';

export interface Producto {
  id?: number;
  codigo: string;
  nombre: string;
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
