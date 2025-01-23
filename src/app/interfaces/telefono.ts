export interface Telefono {
  id: number;
  telefono: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface CreateTelefonoDTO {
  telefono: string;
}
