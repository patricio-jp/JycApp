import { Cliente } from './cliente';

export interface Zona {
  id: number;
  nombre: string;
  clientes?: Cliente[];
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface CreateZonaDTO {
  nombre: string;
}
