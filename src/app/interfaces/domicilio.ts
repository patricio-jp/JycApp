export interface Domicilio {
  id: number;
  direccion: string;
  barrio: string;
  localidad: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface CreateDomicilioDTO {
  direccion: string;
  barrio: string;
  localidad: string;
}
