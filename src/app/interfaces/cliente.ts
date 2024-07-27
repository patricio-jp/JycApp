import { Domicilio } from './domicilio';
import { Telefono } from './telefono';

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
  saldo?: number;
  observaciones?: string;
  estado?: EstadoCliente;
}
