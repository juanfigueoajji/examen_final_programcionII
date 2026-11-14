
import React from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { C } from "../constants/theme";

export function Page({ children }: { children: React.ReactNode }) {
  return (
    <ScrollView
      style={s.page}
      contentContainerStyle={s.body}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  );
}

export function Title({ children }: { children: React.ReactNode }) {
  return <Text style={s.title}>{children}</Text>;
}

export function Label({ children }: { children: React.ReactNode }) {
  return <Text style={s.label}>{children}</Text>;
}

type FieldProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: any;
  placeholder?: string;
};

export function Field({
  label,
  value,
  onChangeText,
  secureTextEntry,
  keyboardType,
  placeholder,
}: FieldProps) {
  return (
    <View style={{ marginBottom: 12 }}>
      <Label>{label}</Label>
      <TextInput
        style={s.input}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        placeholder={placeholder}
        placeholderTextColor={C.muted}
        autoCapitalize="none"
      />
    </View>
  );
}

export function Button({
  title,
  onPress,
  disabled,
  danger,
}: {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  danger?: boolean;
}) {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={[
        s.button,
        danger && { backgroundColor: C.danger },
        disabled && { opacity: 0.5 },
      ]}
    >
      <Text style={s.buttonText}>{title}</Text>
    </Pressable>
  );
}

export function Card({ children }: { children: React.ReactNode }) {
  return <View style={s.card}>{children}</View>;
}

export function Busy() {
  return (
    <View
      style={[
        s.page,
        { justifyContent: "center", alignItems: "center" },
      ]}
    >
      <ActivityIndicator size="large" color={C.accent} />
    </View>
  );
}

export const s = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: C.bg,
  },
  body: {
    padding: 22,
    paddingBottom: 50,
  },
  title: {
    color: C.accent,
    fontSize: 27,
    fontWeight: "800",
    marginBottom: 18,
  },
  label: {
    color: C.text,
    fontSize: 15,
    marginBottom: 6,
  },
  input: {
    backgroundColor: C.card,
    color: C.text,
    borderColor: C.line,
    borderWidth: 1,
    borderRadius: 12,
    padding: 13,
    fontSize: 16,
  },
  button: {
    backgroundColor: C.accent,
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
    marginVertical: 7,
  },
  buttonText: {
    color: C.bg,
    fontWeight: "800",
    fontSize: 16,
  },
  card: {
    backgroundColor: C.card,
    borderRadius: 15,
    padding: 16,
    marginVertical: 8,
  },
  text: {
    color: C.text,
    fontSize: 16,
  },
  muted: {
    color: C.muted,
    fontSize: 14,
  },
});
