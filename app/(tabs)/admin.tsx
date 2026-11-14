
import React, { useCallback, useState } from "react";
import { Alert, Text } from "react-native";
import { router, useFocusEffect } from "expo-router";

import {
  Page, Title, Card, Button, s,
} from "@/components/UI";

import { useAuth } from "@/context/AuthContext";

import {
  listarPeliculas,
  eliminarPelicula,
} from "@/services/data";

import type { Movie } from "@/types/models";

export default function Admin() {
  const { profile } = useAuth();
  const [items, setItems] = useState<Movie[]>([]);

  const cargar = useCallback(async () => {
    const datos = await listarPeliculas();
    setItems(datos);
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (profile?.rol === "admin") {
        cargar().catch((e) =>
          Alert.alert("Error", e.message)
        );
      }
    }, [profile?.rol, cargar])
  );

  if (profile?.rol !== "admin") {
    return <Page><Title>Acceso restringido</Title></Page>;
  }

  function borrar(pelicula: Movie) {
    Alert.alert(
      "Eliminar película",
      `¿Deseas eliminar ${pelicula.titulo}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await eliminarPelicula(pelicula.id);
              await cargar();
              Alert.alert("Éxito", "Película eliminada");
            } catch (e: any) {
              Alert.alert("Error", e.message);
            }
          },
        },
      ]
    );
  }

  return (
    <Page>
      <Title>🛡️ Administrador</Title>

      <Button
        title="➕ Agregar película"
        onPress={() => router.push("/agregar")}
      />

      <Button
        title="📊 Informe de rentas"
        onPress={() => router.push("/informe")}
      />

      {items.map((pelicula) => (
        <Card key={pelicula.id}>
          <Text style={s.text}>
            {pelicula.titulo}
          </Text>

          <Text style={s.muted}>
            Q{Number(pelicula.precio).toFixed(2)}
          </Text>

          <Button
            title="Eliminar película"
            danger
            onPress={() => borrar(pelicula)}
          />
        </Card>
      ))}
    </Page>
  );
}
