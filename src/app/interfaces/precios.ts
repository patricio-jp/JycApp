import { Producto } from './producto';

interface Historico {
  id?: number;
  precioUnitario: number;
  fechaInicio: Date;
  fechaFin?: Date;
  producto?: Producto;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface Costo extends Historico {}

export interface Precio extends Historico {}

export interface CreateCostoDTO {
  precioUnitario: number;
  fechaInicio: Date;
  fechaFin?: Date;
}

export interface CreatePrecioDTO {
  precioUnitario: number;
  fechaInicio: Date;
  fechaFin?: Date;
}
