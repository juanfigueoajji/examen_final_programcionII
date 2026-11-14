
import React, { useEffect } from "react";
import { Stack, useRouter, useSegments } from "expo-router";

import {
  AuthProvider,
  useAuth,
} from "@/context/AuthContext";

import { Busy } from "@/components/UI";

function Navigation() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (loading) return;

    const ruta = segments[0];

    const publica =
      ruta === "login" || ruta === "registro";

    const administrativa =
      ruta === "admin" ||
      ruta === "agregar" ||
      ruta === "informe";

    if (!user && !publica) {
      router.replace("/login");
    } else if (user && profile && publica) {
      router.replace("/");
    } else if (
      user &&
      profile &&
      administrativa &&
      profile.rol !== "admin"
    ) {
      router.replace("/");
    }
  }, [user, profile, loading, segments, router]);

  if (loading) return <Busy />;

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#172338",
        },
        headerTintColor: "#ffffff",
        contentStyle: {
          backgroundColor: "#0b1220",
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{ title: "Inicio" }}
      />
      <Stack.Screen
        name="login"
        options={{ title: "Iniciar sesión" }}
      />
      <Stack.Screen
        name="registro"
        options={{ title: "Registro" }}
      />
      <Stack.Screen
        name="perfil"
        options={{ title: "Perfil" }}
      />
      <Stack.Screen
        name="peliculas"
        options={{ title: "Películas" }}
      />
      <Stack.Screen
        name="mis-rentas"
        options={{ title: "Mis rentas" }}
      />
      <Stack.Screen
        name="admin"
        options={{ title: "Administrador" }}
      />
      <Stack.Screen
        name="agregar"
        options={{ title: "Agregar película" }}
      />
      <Stack.Screen
        name="informe"
        options={{ title: "Informe de rentas" }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <Navigation />
    </AuthProvider>
  );
}
