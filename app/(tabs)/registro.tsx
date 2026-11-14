
import React, { useState } from "react";
import { Alert, Text } from "react-native";
import { router } from "expo-router";

import {
  Page, Title, Field, Button, s,
} from "@/components/UI";

import { registrar } from "@/services/data";

export default function Registro() {
  const [nombre, setNombre] = useState("");
  const [edad, setEdad] = useState("");
  const [tarjeta, setTarjeta] = useState("");
  const [foto, setFoto] = useState("");
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [busy, setBusy] = useState(false);

  async function guardar() {
    if (
      !nombre.trim() ||
      !correo.includes("@") ||
      !Number.isInteger(Number(edad)) ||
      Number(edad) < 18 ||
      Number(edad) > 120 ||
      !/^[0-9]{4}$/.test(tarjeta) ||
      clave.length < 6
    ) {
      Alert.alert(
        "Datos inválidos",
        "Completa todos los campos obligatorios. Edad de 18 a 120 años, cuatro dígitos de tarjeta y contraseña de al menos 6 caracteres."
      );
      return;
    }

    setBusy(true);

    try {
      const resultado = await registrar(
        nombre,
        Number(edad),
        tarjeta,
        foto,
        correo,
        clave
      );

      if (!resultado.session) {
        Alert.alert(
          "Registro exitoso",
          "Revisa tu correo para confirmar la cuenta antes de iniciar sesión."
        );
        router.replace("/login");
      } else {
        router.replace("/");
      }
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Page>
      <Title>📝 Crear cuenta</Title>

      <Field
        label="Nombre completo"
        value={nombre}
        onChangeText={setNombre}
      />

      <Field
        label="Edad"
        value={edad}
        onChangeText={setEdad}
        keyboardType="numeric"
      />

      <Field
        label="Últimos cuatro dígitos de tarjeta"
        value={tarjeta}
        onChangeText={setTarjeta}
        keyboardType="numeric"
      />

      <Field
        label="URL de fotografía (opcional)"
        value={foto}
        onChangeText={setFoto}
      />

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

      <Text style={[s.muted, { marginBottom: 10 }]}>
        Por seguridad, no ingreses tu número completo
        de tarjeta. Utiliza únicamente cuatro dígitos
        de prueba.
      </Text>

      <Button
        title={busy ? "Registrando..." : "Registrarme"}
        onPress={guardar}
        disabled={busy}
      />
    </Page>
  );
}
