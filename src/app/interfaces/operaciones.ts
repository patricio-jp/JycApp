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
  comprobanteUrl?: string;
  subtotal?: number;
  descuento?: number;
  total: number;
  condicion: CondicionOperacion;
  observaciones?: string;
  estado: EstadoOperacion;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
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

export interface VentaAPICounter {
  data: {
    estado: EstadoOperacion;
    condicion: CondicionOperacion;
    count: number;
  }[];
  count: number;
}

export interface CreateVentaDTO {
  fecha: Date | string;
  comprobante?: string;
  comprobante_url?: string;
  subtotal?: number;
  descuento?: number;
  total: number;
  condicion: CondicionOperacion;
  observaciones?: string;
  estado?: EstadoOperacion;
  fechaEntrega?: Date | string;
  cliente_id: number;
  productos: CreateDetVentaDTO[];
  financiacion?: CreateCreditoDTO;
}

export interface CreateDetVentaDTO {
  id_producto: number;
  cantidad: number;
  precioUnitario: number;
}

export interface VentasFilter {
  cliente?: string;
  fecha?: Date | string;
  estado?: EstadoOperacion;
  condicion?: CondicionOperacion;
  productos?: string;
  searchTerm?: string;
  mostrarEliminados?: boolean;
  orderBy?: string;
  orderDir?: 'asc' | 'desc';
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
