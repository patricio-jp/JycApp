import { Cliente } from './cliente';
import { CreateCreditoDTO, Credito } from './credito';
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
  id: number;
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
  producto: Producto;
  cantidad: number;
  precioUnitario: number;
}

export interface VentasAPIResponse {
  data: Venta[];
  count: number;
}

export interface CreateVentaDTO {
  fecha: Date;
  comprobante?: string;
  comprobante_url?: string;
  subtotal?: number;
  descuento?: number;
  total: number;
  condicion: CondicionOperacion;
  observaciones?: string;
  estado?: EstadoOperacion;
  fechaEntrega?: Date;
  cliente_id: number;
  productos: CreateDetVentaDTO[];
  financiacion?: CreateCreditoDTO;
}

export interface CreateDetVentaDTO {
  producto_id: number;
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

export interface ComprasAPIResponse {
  data: Compra[];
  count: number;
}

export interface CreateCompraDTO {
  fecha: Date;
  comprobante?: string;
  comprobante_url?: string;
  subtotal?: number;
  descuento?: number;
  total: number;
  condicion: CondicionOperacion;
  observaciones?: string;
  estado?: EstadoOperacion;
  fechaRecepcion?: Date;
  productos: CreateDetCompraDTO[];
}

export interface CreateDetCompraDTO {
  producto_id: number;
  cantidad: number;
  costoUnitario: number;
}
