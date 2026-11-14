
import React, { useCallback, useState } from "react";
import {
  Alert, Image, Text,
} from "react-native";

import { useFocusEffect } from "expo-router";

import {
  Page, Title, Card, Field, Button, s,
} from "@/components/UI";

import {
  listarPeliculas,
  rentarPelicula,
} from "@/services/data";

import type { Movie } from "@/types/models";

export default function Peliculas() {
  const [items, setItems] = useState<Movie[]>([]);
  const [dias, setDias] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let activo = true;

      listarPeliculas()
        .then((datos) => {
          if (activo) setItems(datos);
        })
        .catch((e) => Alert.alert("Error", e.message));

      return () => {
        activo = false;
      };
    }, [])
  );

  async function rentar(pelicula: Movie) {
    const cantidad = Number(dias[pelicula.id] ?? "1");

    if (
      !Number.isInteger(cantidad) ||
      cantidad < 1 ||
      cantidad > 30
    ) {
      Alert.alert("Error", "Ingresa entre 1 y 30 días");
      return;
    }

    setBusy(true);

    try {
      await rentarPelicula(pelicula.id, cantidad);

      Alert.alert(
        "Renta exitosa",
        `Rentaste ${pelicula.titulo} por ${cantidad} día(s).`
      );
    } catch (e: any) {
      Alert.alert("Error", e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Page>
      <Title>🎞️ Películas disponibles</Title>

      {items.length === 0 && (
        <Text style={s.muted}>
          No hay películas registradas.
        </Text>
      )}

      {items.map((pelicula) => (
        <Card key={pelicula.id}>
          {!!pelicula.imagen_url && (
            <Image
              source={{ uri: pelicula.imagen_url }}
              style={{
                height: 170,
                borderRadius: 10,
                marginBottom: 12,
              }}
              resizeMode="cover"
            />
          )}

          <Text style={[s.text, { fontWeight: "bold" }]}>
            {pelicula.titulo}
          </Text>

          <Text style={s.muted}>
            Género: {pelicula.genero}
          </Text>

          <Text style={s.text}>
            {pelicula.descripcion}
          </Text>

          <Text style={s.text}>
            Precio: Q{Number(pelicula.precio).toFixed(2)}
          </Text>

          <Field
            label="Cantidad de días"
            value={dias[pelicula.id] ?? "1"}
            keyboardType="numeric"
            onChangeText={(valor) =>
              setDias((prev) => ({
                ...prev,
                [pelicula.id]: valor,
              }))
            }
          />

          <Button
            title={busy ? "Procesando..." : "Rentar"}
            onPress={() => rentar(pelicula)}
            disabled={busy}
          />
        </Card>
      ))}
    </Page>
  );
}
