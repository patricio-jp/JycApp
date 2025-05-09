import { CreateDomicilioDTO, Domicilio } from './domicilio';
import { Recibo } from './ingreso';
import { Venta } from './operaciones';
import { CreateTelefonoDTO, Telefono } from './telefono';
import { Usuario } from './usuario';
import { Zona } from './zona';

export enum EstadoCliente {
  AConfirmar, // Nuevo cliente
  Inactivo, // Sin créditos vigentes
  Activo, // Con 1 o más créditos vigentes
  ConDeuda, // Debe 1 o 2 cuotas de un crédito
  Incobrable, // Debe más de 2-3 cuotas de un crédito
}

export interface Cliente {
  id?: number;
  dni: number;
  nombre: string;
  apellido?: string;
  fechaNacimiento?: Date;
  domicilios?: Domicilio[];
  telefonos?: Telefono[];
  vendedorAsociado?: Usuario;
  vendedorAsociadoHasta?: Date;
  cobradorAsociado?: Usuario;
  zona?: Zona;
  saldo?: number;
  observaciones?: string;
  estado: EstadoCliente;
  ventas?: Venta[];
  pagos?: Recibo[];
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

// Create DTO for app
export interface CreateClienteDTO {
  dni: number;
  nombre: string;
  apellido?: string;
  fechaNacimiento?: Date;
  domicilios?: CreateDomicilioDTO[];
  telefonos?: CreateTelefonoDTO[];
  id_vendedorAsociado?: number;
  id_cobradorAsociado?: number;
  id_zona?: number;
  saldo?: number;
  observaciones?: string;
  estado?: EstadoCliente;
}

// Get all from server
export interface ClienteAPIResponse {
  data: Cliente[];
  count: number;
}

export interface ClienteAPICounter {
  data: { estado: EstadoCliente; count: number }[];
  count: number;
}

export interface ClientesFilter {
  searchTerm?: string; // Usado para campos simples de la entidad
  domicilio?: string;
  estado?: EstadoCliente;
  zona?: string;
  apariciones?: string;
  mostrarEliminados?: boolean;
  orderBy?: string;
  orderDir?: 'asc' | 'desc';
}
