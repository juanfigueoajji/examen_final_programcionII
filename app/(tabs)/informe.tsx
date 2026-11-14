
import React, { useCallback, useState } from "react";
import { Alert, Text } from "react-native";
import { useFocusEffect } from "expo-router";

import {
  Page, Title, Card, s,
} from "@/components/UI";

import { useAuth } from "@/context/AuthContext";
import { listarRentas } from "@/services/data";
import type { Rental } from "@/types/models";

export default function Informe() {
  const { user, profile } = useAuth();
  const [items, setItems] = useState<Rental[]>([]);

  useFocusEffect(
    useCallback(() => {
      let activo = true;

      if (user && profile?.rol === "admin") {
        listarRentas(user.id, true)
          .then((datos) => {
            if (activo) setItems(datos);
          })
          .catch((e) => Alert.alert("Error", e.message));
      }

      return () => {
        activo = false;
      };
    }, [user?.id, profile?.rol])
  );

  if (profile?.rol !== "admin") {
    return <Page><Title>Acceso restringido</Title></Page>;
  }

  const total = items.reduce(
    (suma, renta) => suma + Number(renta.precio),
    0
  );

  return (
    <Page>
      <Title>📊 Informe de rentas</Title>

      <Card>
        <Text style={s.text}>
          Rentas realizadas: {items.length}
        </Text>

        <Text style={s.text}>
          Total registrado: Q{total.toFixed(2)}
        </Text>
      </Card>

      {items.map((renta) => (
        <Card key={renta.id}>
          <Text style={s.text}>
            Película: {renta.pelicula_titulo}
          </Text>

          <Text style={s.text}>
            Usuario: {renta.usuario_nombre}
          </Text>

          <Text style={s.muted}>
            Inicio:{" "}
            {new Date(renta.fecha_inicio).toLocaleString()}
          </Text>

          <Text style={s.muted}>
            Fin:{" "}
            {new Date(renta.fecha_fin).toLocaleString()}
          </Text>

          <Text style={s.text}>
            Precio: Q{Number(renta.precio).toFixed(2)}
          </Text>
        </Card>
      ))}
    </Page>
  );
}
