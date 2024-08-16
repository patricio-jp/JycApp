import { Cliente } from './cliente';

export interface Zona {
  id?: number;
  nombre: string;
  clientes?: Cliente[];
}
