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
  cuotas: Cuota[];
}

export interface CreditoVenta extends Omit<Credito, 'venta'> {}

export interface CreateCreditoDTO {
  fechaInicio: Date;
  fechaUltimoPago?: Date;
  anticipo?: number;
  cantidadCuotas: number;
  montoCuota: number;
  periodo: Periodo;
  estado?: EstadoCredito;
}

export interface CargarPagoDTO {
  monto: number;
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
