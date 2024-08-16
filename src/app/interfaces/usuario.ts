import { Cliente } from './cliente';
import { Domicilio } from './domicilio';
import { Telefono } from './telefono';

export enum Rol {
  Vendedor,
  Cobrador,
  Supervisor,
  Administrador,
}

export interface Usuario {
  id?: number;
  dni: number;
  nombre: string;
  apellido: string;
  password?: string;
  fechaNacimiento: Date;
  domicilios?: Domicilio[];
  telefonos?: Telefono[];
  fechaInicio: Date;
  rol: Rol;
  comision?: number;
  saldo?: number;
  observaciones?: string;
  clientesAsociados?: Cliente[];
  clientesACobrar?: Cliente[];
}

export interface LoginInfo {
  dni: number;
  password: string;
}
