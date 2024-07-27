import { Cliente } from './cliente';
import { Credito } from './credito';
import { Producto } from './producto';

export enum CondicionOperacion {
  CONTADO = 'CONTADO',
  CTA_CTE = 'CTA CTE',
}

export enum EstadoOperacion {
  Pendiente,
  // Aprobado,
  ParaEntregar,
  Pagado, // En caso de venta al contado
  Entregado,
  Anulado,
}

interface Operacion {
  id?: number;
  fecha: Date;
  comprobante?: string;
  comprobante_url?: string;
  subtotal?: number;
  descuento?: number;
  total: number;
  condicion: CondicionOperacion;
  observaciones?: string;
  estado: EstadoOperacion;
}

export interface Venta extends Operacion {
  fechaEntrega?: Date;
  cliente_id: number;
  cliente?: Cliente;
  productos: DetalleVenta[];
  financiacion?: Credito[];
}

export interface DetalleVenta {
  producto_id: number;
  producto?: Producto;
  cantidad: number;
  precioUnitario: number;
}

export interface Compra extends Operacion {
  fechaRecepcion?: Date;
  productos: DetalleCompra[];
}

export interface DetalleCompra {
  producto_id: number;
  producto?: Producto;
  cantidad: number;
  costoUnitario: number;
}
