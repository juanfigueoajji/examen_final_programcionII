
import { supabase } from "./supabase";
import type {
  Profile,
  Movie,
  Rental,
} from "../types/models";

// REGISTRO
export async function registrar(
  nombre: string,
  edad: number,
  tarjetaUltimos4: string,
  fotoUrl: string,
  correo: string,
  clave: string
) {
  const { data, error } = await supabase.auth.signUp({
    email: correo.trim().toLowerCase(),
    password: clave,
    options: {
      data: {
        nombre: nombre.trim(),
        edad,
        tarjeta_ultimos4: tarjetaUltimos4,
        foto_url: fotoUrl.trim(),
      },
    },
  });

  if (error) throw error;
  return data;
}

// INICIAR SESIÓN
export async function ingresar(
  correo: string,
  clave: string
) {
  const { data, error } =
    await supabase.auth.signInWithPassword({
      email: correo.trim(),
      password: clave,
    });

  if (error) throw error;
  return data;
}

// CERRAR SESIÓN
export async function salir() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

// CONSULTAR PERFIL
export async function obtenerPerfil(
  uid: string
): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("perfiles")
    .select("*")
    .eq("id", uid)
    .single();

  if (error) throw error;
  return data as Profile;
}

// LISTAR PELÍCULAS
export async function listarPeliculas(): Promise<Movie[]> {
  const { data, error } = await supabase
    .from("peliculas")
    .select("*")
    .order("titulo", { ascending: true });

  if (error) throw error;
  return (data ?? []) as Movie[];
}

// AGREGAR PELÍCULA
export async function agregarPelicula(
  pelicula: Omit<Movie, "id">
) {
  const { error } = await supabase
    .from("peliculas")
    .insert(pelicula);

  if (error) throw error;
}

// ELIMINAR PELÍCULA
export async function eliminarPelicula(id: string) {
  const { error } = await supabase
    .from("peliculas")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

// RENTAR PELÍCULA
export async function rentarPelicula(
  peliculaId: string,
  dias: number
) {
  const { data, error } = await supabase.rpc(
    "rentar_pelicula",
    {
      p_pelicula_id: peliculaId,
      p_dias: dias,
    }
  );

  if (error) throw error;
  return data;
}

// LISTAR RENTAS
export async function listarRentas(
  uid: string,
  admin: boolean
): Promise<Rental[]> {
  let consulta = supabase
    .from("rentas")
    .select("*")
    .order("fecha_inicio", { ascending: false });

  if (!admin) {
    consulta = consulta.eq("usuario_id", uid);
  }

  const { data, error } = await consulta;

  if (error) throw error;
  return (data ?? []) as Rental[];
}
