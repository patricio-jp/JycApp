import { Producto } from './producto';

interface Historico {
  id?: number;
  precioUnitario: number;
  fechaInicio: Date;
  fechaFin: Date | null;
}

export interface Costo extends Historico {
  id_producto: number;
  producto?: Producto;
}

export interface Precio extends Historico {
  id_producto: number;
  producto?: Producto;
}
