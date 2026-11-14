
import React, { useState } from "react";
import { Alert, Text } from "react-native";
import { router } from "expo-router";

import {
  Page, Title, Field, Button, s,
} from "@/components/UI";

import { ingresar } from "@/services/data";

export default function Login() {
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [busy, setBusy] = useState(false);

  async function iniciar() {
    if (!correo.trim() || !clave) {
      Alert.alert("Error", "Completa todos los campos");
      return;
    }

    setBusy(true);

    try {
      await ingresar(correo, clave);
      router.replace("/");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Page>
      <Title>🎬 Renta Virtual</Title>
      <Text style={[s.muted, { marginBottom: 20 }]}>
        Inicia sesión para rentar películas
      </Text>

      <Field
        label="Correo electrónico"
        value={correo}
        onChangeText={setCorreo}
        keyboardType="email-address"
      />

      <Field
        label="Contraseña"
        value={clave}
        onChangeText={setClave}
        secureTextEntry
      />

      <Button
        title={busy ? "Ingresando..." : "Iniciar sesión"}
        onPress={iniciar}
        disabled={busy}
      />

      <Button
        title="Crear cuenta"
        onPress={() => router.push("/registro")}
      />
    </Page>
  );
}
