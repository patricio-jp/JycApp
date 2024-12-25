export interface Login {
  dni: number;
  password: string;
}

export interface LoginSuccess {
  access_token: string;
  refresh_token: string;
}

export interface LoginError {
  statusCode: number;
  message: string;
}

export type LoginResponse = LoginSuccess | LoginError;
