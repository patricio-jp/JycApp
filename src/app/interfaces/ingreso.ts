import { Cliente } from './cliente';

export enum FormaPago {
  Efectivo,
  Transferencia,
}

export enum EstadoIngreso {
  Pendiente,
  Recibido,
  Anulado,
}

export interface Ingreso {
  id: number;
  fecha: Date;
  concepto: string;
  importe: number;
  formaPago: FormaPago;
  estado: EstadoIngreso;
  recibo: Recibo;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface Recibo {
  id: number;
  uuid: string;
  cliente: Cliente;
  ingreso: Ingreso;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface IngresosFilter {
  fecha?: Date | string;
  cliente?: string;
  formaPago?: FormaPago;
  estado?: EstadoIngreso;
  searchTerm?: string;
  mostrarEliminados?: boolean;
  counterQuery?: boolean;
  orderBy?: string;
  orderDir?: 'asc' | 'desc';
}

export interface CreateIngresoDTO {
  fecha: Date;
  concepto: string;
  importe: number;
  formaPago: FormaPago;
  estado?: EstadoIngreso;
  cliente_id: number;
}

export interface IngresoAPIResponse {
  data: Ingreso[];
  count: number;
}

export interface IngresoAPICounter {
  data: {
    eliminado: boolean;
    formaPago: FormaPago;
    count: number;
  }[];
  count: number;
}
