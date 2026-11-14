
import React, { useState } from "react";
import { Alert } from "react-native";
import { router } from "expo-router";

import {
  Page, Title, Field, Button,
} from "@/components/UI";

import { useAuth } from "@/context/AuthContext";
import { agregarPelicula } from "@/services/data";

export default function Agregar() {
  const { profile } = useAuth();

  const [titulo, setTitulo] = useState("");
  const [genero, setGenero] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [imagen, setImagen] = useState("");
  const [precio, setPrecio] = useState("");
  const [busy, setBusy] = useState(false);

  if (profile?.rol !== "admin") {
    return <Page><Title>Acceso restringido</Title></Page>;
  }

  async function guardar() {
    const valor = Number(precio);

    if (
      !titulo.trim() ||
      !genero.trim() ||
      !descripcion.trim() ||
      !precio.trim() ||
      !Number.isFinite(valor) ||
      valor <= 0
    ) {
      Alert.alert("Error", "Completa los datos correctamente");
      return;
    }

    setBusy(true);

    try {
      await agregarPelicula({
        titulo: titulo.trim(),
        genero: genero.trim(),
        descripcion: descripcion.trim(),
        imagen_url: imagen.trim(),
        precio: valor,
      });

      Alert.alert("Éxito", "Película agregada");
      router.back();
    } catch (e: any) {
      Alert.alert("Error", e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Page>
      <Title>➕ Agregar película</Title>

      <Field
        label="Título"
        value={titulo}
        onChangeText={setTitulo}
      />

      <Field
        label="Género"
        value={genero}
        onChangeText={setGenero}
      />

      <Field
        label="Descripción"
        value={descripcion}
        onChangeText={setDescripcion}
      />

      <Field
        label="URL de imagen"
        value={imagen}
        onChangeText={setImagen}
      />

      <Field
        label="Precio en quetzales"
        value={precio}
        onChangeText={setPrecio}
        keyboardType="decimal-pad"
      />

      <Button
        title={busy ? "Guardando..." : "Guardar película"}
        onPress={guardar}
        disabled={busy}
      />
    </Page>
  );
}
