import { GrupoCartones } from './carton';
import { Periodo } from './credito';
import { Domicilio } from './domicilio';

interface InfoCredito {
  id: number;
  fechaInicio: Date;
  cantidadCuotas: number;
  periodo: Periodo;
  montoCuota: number;
  comprobante: string;
}

interface InfoCreditoCliente extends InfoCredito {
  grupoCartones: GrupoCartones | null;
  totalMes: number;
}

interface InfoCliente {
  id: number;
  nombre: string;
  apellido: string;
  telefonos: string[];
  domicilios: Domicilio[];
}

export interface InfoClienteMensual extends InfoCliente {
  creditos: InfoCreditoCliente[];
  totalMes: number;
}

export interface InfoClienteSemanal extends InfoCliente {}

interface InfoCuotaSemanal {
  numero: number;
  fechaVencimiento: Date;
}

export interface InfoDiaCreditoSemanal {
  cliente: InfoClienteSemanal;
  credito: InfoCredito;
  cuota: InfoCuotaSemanal;
}
