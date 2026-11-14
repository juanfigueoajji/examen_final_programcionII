
import React from "react";
import { Text } from "react-native";
import { router } from "expo-router";

import {
  Page, Title, Card, Button, s,
} from "@/components/UI";

import { useAuth } from "@/context/AuthContext";
import { salir } from "@/services/data";

export default function Inicio() {
  const { user, profile } = useAuth();

  if (!user || !profile) {
    return (
      <Page>
        <Title>Renta Virtual</Title>
        <Text style={s.muted}>
          Esperando perfil o inicio de sesión...
        </Text>
        <Button
          title="Ir al login"
          onPress={() => router.replace("/login")}
        />
        <Button title="Cerrar sesión" onPress={salir} />
      </Page>
    );
  }

  return (
    <Page>
      <Title>🎬 Renta Virtual</Title>

      <Card>
        <Text style={s.text}>
          Bienvenido, {profile.nombre}
        </Text>
        <Text style={s.muted}>
          Rol: {profile.rol}
        </Text>
      </Card>

      <Button
        title="👤 Mi perfil"
        onPress={() => router.push("/perfil")}
      />

      <Button
        title="🎞️ Catálogo de películas"
        onPress={() => router.push("/peliculas")}
      />

      <Button
        title="📋 Mis rentas"
        onPress={() => router.push("/mis-rentas")}
      />

      {profile.rol === "admin" && (
        <Button
          title="🛡️ Administrador"
          onPress={() => router.push("/admin")}
        />
      )}

      <Button title="Cerrar sesión" onPress={salir} />
    </Page>
  );
}
