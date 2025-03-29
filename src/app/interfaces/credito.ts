import { Carton, EstadoCarton } from './carton';
import { FormaPago } from './ingreso';
import { Venta } from './operaciones';

export enum EstadoCredito {
  Pendiente,
  Activo,
  Pagado, // Crédito pagado por completo
  EnDeuda, // Crédito con deuda pendiente (al menos 1 cuota vencida)
  Anulado,
}

export enum Periodo {
  Mensual,
  Quincenal,
  Semanal,
}

export interface Credito {
  id: number;
  venta: Venta;
  fechaInicio: Date;
  fechaUltimoPago?: Date;
  anticipo?: number;
  cantidadCuotas: number;
  montoCuota: number;
  periodo: Periodo;
  estado: EstadoCredito;
  carton: Carton;
  cuotas: Cuota[];
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface CreateCreditoDTO {
  fechaInicio: Date;
  fechaUltimoPago?: Date;
  anticipo?: number;
  formaPagoAnticipo?: FormaPago;
  cantidadCuotas: number;
  montoCuota: number;
  periodo: Periodo;
  estado?: EstadoCredito;
}

export interface CreditosFilter {
  estadoCredito?: EstadoCredito | EstadoCredito[];
  periodo?: Periodo;
  estadoCarton?: EstadoCarton;
  fechaVencCuota?: Date | string;
  fechaUltimoPago?: Date | string;
  searchTerm?: string;
  mostrarEliminados?: boolean;
}

export interface CargarPagoDTO {
  monto: number;
  formaPago: FormaPago;
  fechaPago?: Date;
  creditoId: number;
}

export enum EstadoCuota {
  aVencer,
  Vencida,
  Pagada,
  Anulada,
}

interface Cuota {
  id?: number;
  id_credito: number;
  credito?: Credito;
  cuotaNro: number;
  fechaVencimiento: Date;
  montoCuota: number;
  fechaPago: Date | null;
  montoPagado: number;
  estado: EstadoCuota;
  observaciones?: string;
}

export interface CreditoAPIResponse {
  data: Credito[];
  count: number;
}

export interface CreditoAPICounter {
  data: {
    estadoCredito: EstadoCredito;
    periodo: Periodo;
    estadoCarton: EstadoCarton;
    count: number;
  }[];
  count: number;
}
