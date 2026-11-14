
import React from "react";
import { Image, Text } from "react-native";

import {
  Page, Title, Card, s,
} from "@/components/UI";

import { useAuth } from "@/context/AuthContext";

export default function Perfil() {
  const { user, profile } = useAuth();

  return (
    <Page>
      <Title>👤 Mi perfil</Title>

      {profile && (
        <Card>
          {!!profile.foto_url && (
            <Image
              source={{ uri: profile.foto_url }}
              style={{
                width: 110,
                height: 110,
                borderRadius: 55,
                marginBottom: 15,
              }}
            />
          )}

          <Text style={s.text}>
            Nombre: {profile.nombre}
          </Text>
          <Text style={s.text}>
            Edad: {profile.edad}
          </Text>
          <Text style={s.text}>
            Correo: {user?.email}
          </Text>
          <Text style={s.text}>
            Tarjeta: **** {profile.tarjeta_ultimos4}
          </Text>
          <Text style={s.text}>
            Rol: {profile.rol}
          </Text>
        </Card>
      )}
    </Page>
  );
}
