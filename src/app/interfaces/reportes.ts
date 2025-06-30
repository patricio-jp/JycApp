import { GrupoCartones } from './carton';
import { Periodo } from './credito';
import { Domicilio } from './domicilio';

export interface InfoClienteMensual {
  id: number;
  nombre: string;
  apellido: string;
  telefonos: string[];
  domicilios: Domicilio[];
  creditos: InfoCreditoCliente[];
  totalMes: number;
}

interface InfoCreditoCliente {
  id: number;
  comprobante: string;
  fechaInicio: Date;
  productos: string[];
  cantidadCuotas: number;
  periodo: Periodo;
  montoCuota: number;
  grupoCartones: GrupoCartones | null;
  totalMes: number;
}
