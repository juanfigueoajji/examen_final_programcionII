
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import type { User } from "@supabase/supabase-js";

import { supabase } from "../services/supabase";
import { obtenerPerfil } from "../services/data";
import type { Profile } from "../types/models";

type AuthValue = {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthValue>({
  user: null,
  profile: null,
  loading: true,
  refreshProfile: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] =
    useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  async function refreshProfile() {
    const { data } = await supabase.auth.getUser();

    if (data.user) {
      const perfil = await obtenerPerfil(data.user.id);
      setUser(data.user);
      setProfile(perfil);
    } else {
      setUser(null);
      setProfile(null);
    }
  }

  useEffect(() => {
    let activo = true;
    let version = 0;

    async function cargar(uid: string | undefined) {
      const actual = ++version;

      if (!uid) {
        if (activo) {
          setUser(null);
          setProfile(null);
          setLoading(false);
        }
        return;
      }

      try {
        const perfil = await obtenerPerfil(uid);

        if (activo && actual === version) {
          setProfile(perfil);
        }
      } catch (error) {
        console.error("Error cargando perfil:", error);
        if (activo && actual === version) {
          setProfile(null);
        }
      } finally {
        if (activo && actual === version) {
          setLoading(false);
        }
      }
    }

    supabase.auth.getUser().then(({ data }) => {
      if (!activo) return;
      setUser(data.user);
      cargar(data.user?.id);
    });

    const { data: listener } =
      supabase.auth.onAuthStateChange((event, session) => {
        if (!activo) return;

        if (event === "INITIAL_SESSION") return;

        setUser(session?.user ?? null);
        setProfile(null);
        setLoading(true);

        // Se programa fuera del callback de autenticación.
        Promise.resolve().then(() =>
          cargar(session?.user?.id)
        );
      });

    return () => {
      activo = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
