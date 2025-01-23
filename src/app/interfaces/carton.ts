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
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface GrupoCartones {
  id: number;
  alias?: string | null;
  cartones: Carton[];
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}
