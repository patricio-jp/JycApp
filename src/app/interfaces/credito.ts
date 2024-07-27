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
  id?: number;
  id_venta?: number;
  venta?: Venta;
  fechaInicio: Date;
  anticipo?: number;
  cantidadCuotas: number;
  montoCuota: number;
  periodo: Periodo;
  estado: EstadoCredito;
  cuotas?: Cuota[];
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
