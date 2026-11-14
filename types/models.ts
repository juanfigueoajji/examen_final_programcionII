
export type Role = "cliente" | "admin";

export interface Profile {
  id: string;
  nombre: string;
  edad: number;
  tarjeta_ultimos4: string;
  foto_url: string;
  rol: Role;
}

export interface Movie {
  id: string;
  titulo: string;
  genero: string;
  descripcion: string;
  imagen_url: string;
  precio: number;
}

export interface Rental {
  id: string;
  usuario_id: string;
  pelicula_id: string | null;
  pelicula_titulo: string;
  usuario_nombre: string;
  fecha_inicio: string;
  fecha_fin: string;
  precio: number;
}
