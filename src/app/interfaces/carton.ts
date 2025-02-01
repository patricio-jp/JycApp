import { Credito } from './credito';

export enum EstadoCarton {
  Pendiente,
  EnDudas,
  Listo,
  Separado, // Para conflictos a resolver luego de dudas
  Llevado,
  Finalizado, // Para créditos pagados/anulados (determinado por el estado del crédito)
}

export interface Carton {
  id: number;
  estado: EstadoCarton;
  fechaCarton?: Date | null;
  credito: Credito;
  grupoCartones?: GrupoCartones;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface CartonAPIResponse {
  data: Carton[];
  count: number;
}

export interface CartonesFilter {
  estado?: EstadoCarton;
  fechaDesde?: Date;
  fechaHasta?: Date;
  searchTerm?: string;
  mostrarEliminados?: boolean;
}

export interface GrupoCartones {
  id: number;
  alias?: string | null;
  cartones: Carton[];
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface CreateGrupoCartonesDTO {
  alias?: string;
}

export interface GrupoCartonesAPIResponse {
  data: GrupoCartones[];
  count: number;
}

export interface CambiarEstadoCartonDTO {
  estado: EstadoCarton;
  fechaCarton?: Date;
  actualizarGrupo?: boolean;
}
