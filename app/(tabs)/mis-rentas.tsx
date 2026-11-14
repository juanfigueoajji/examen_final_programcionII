
import React, { useCallback, useState } from "react";
import { Alert, Text } from "react-native";
import { useFocusEffect } from "expo-router";

import {
  Page, Title, Card, s,
} from "@/components/UI";

import { useAuth } from "@/context/AuthContext";
import { listarRentas } from "@/services/data";
import type { Rental } from "@/types/models";

export default function MisRentas() {
  const { user } = useAuth();
  const [items, setItems] = useState<Rental[]>([]);

  useFocusEffect(
    useCallback(() => {
      let activo = true;

      if (user) {
        listarRentas(user.id, false)
          .then((datos) => {
            if (activo) setItems(datos);
          })
          .catch((e) => Alert.alert("Error", e.message));
      }

      return () => {
        activo = false;
      };
    }, [user?.id])
  );

  return (
    <Page>
      <Title>📋 Mis rentas</Title>

      {items.length === 0 && (
        <Text style={s.muted}>
          Aún no tienes rentas registradas.
        </Text>
      )}

      {items.map((renta) => (
        <Card key={renta.id}>
          <Text style={s.text}>
            {renta.pelicula_titulo}
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
