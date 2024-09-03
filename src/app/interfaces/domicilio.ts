export interface Domicilio {
  id: number;
  direccion: string;
  barrio: string;
  localidad: string;
}

export interface CreateDomicilioDTO {
  direccion: string;
  barrio: string;
  localidad: string;
}
