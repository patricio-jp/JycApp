import { Domicilio } from './domicilio';
import { Venta } from './operaciones';
import { Telefono } from './telefono';
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
  id_vendedorAsociado?: number;
  vendedorAsociadoHasta?: Date;
  cobradorAsociado?: Usuario;
  id_cobradorAsociado?: number;
  zona?: Zona;
  id_zona: number;
  saldo?: number;
  observaciones?: string;
  estado: EstadoCliente;
  ventas?: Venta[];
}

export interface ClienteAPIResponse {
  data: Cliente[];
  count: number;
}
