import { Costo, CreateCostoDTO, CreatePrecioDTO, Precio } from './precios';

export interface Producto {
  id: number;
  codigo: string;
  nombre: string;
  costos: Costo[];
  precios: Precio[];
  stock: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface CreateProductoDTO {
  codigo: string;
  nombre: string;
  costos?: CreateCostoDTO[];
  precios?: CreatePrecioDTO[];
  stock?: number;
}

export interface ProductosAPIResponse {
  data: Producto[];
  count: number;
}

export interface ProductoAPI {
  id: number;
  codigo: string;
  nombre: string;
  costos: Costo[];
  precios: Precio[];
}

export interface Inventario {
  id?: number;
  stock: number;
  id_producto?: number;
}

export interface ProductosFilter {
  searchTerm?: string;
  mostrarEliminados?: boolean;
  orderBy?: string;
  orderDir?: 'asc' | 'desc';
}
/* @Injectable({
  providedIn: 'root',
})
export class ProductoMapper extends Mapper<ProductoAPI, Producto> {
  protected map(entity: ProductoAPI): Producto {
    console.log(entity);
    return {
      ...entity,
      stock: 2,
    };
  }
} */
