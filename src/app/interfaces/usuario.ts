import { Cliente } from './cliente';
import { CreateDomicilioDTO, Domicilio } from './domicilio';
import { CreateTelefonoDTO, Telefono } from './telefono';

export enum Rol {
  Vendedor,
  Cobrador,
  Supervisor,
  Administrador,
}

export enum EstadoUsuario {
  Normal,
  Deshabilitado,
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
  estado: EstadoUsuario;
  comision?: number;
  saldo?: number;
  observaciones?: string;
  clientesAsociados?: Cliente[];
  clientesACobrar?: Cliente[];
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface CreateUsuarioDTO {
  dni: number;
  nombre: string;
  apellido: string;
  password: string;
  confirmPassword: string;
  fechaNacimiento: Date;
  domicilios?: CreateDomicilioDTO[];
  telefonos?: CreateTelefonoDTO[];
  fechaInicio: Date;
  rol: Rol;
  estado?: EstadoUsuario;
  comision?: number;
  saldo?: number;
  observaciones?: string;
}

export interface RestorePasswordDTO {
  user_dni?: number;
  password: string;
  confirmPassword: string;
}

export interface SelfRestorePasswordDTO extends RestorePasswordDTO {
  oldPassword: string;
}

export interface UsuarioAPIResponse {
  data: Usuario[];
  count: number;
}

export interface UsuarioAPICounter {
  data: {
    rol: Rol;
    count: number;
  }[];
  count: number;
}

export interface UsuariosFilter {
  searchTerm?: string;
  domicilio?: string;
  rol?: Rol;
  mostrarEliminados?: boolean;
}
