import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getCurrentUser, getDisplayName } from "../lib/auth";
import { supabase } from "../lib/supabase";
import { User } from "../types";

interface AuthState {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthState>({
  user: null,
  loading: true,
  setUser: () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const subscription = supabase.auth.onAuthStateChange((event, session) => {
      const u = session?.user;
      if (
        event === "SIGNED_IN" ||
        event === "INITIAL_SESSION" ||
        event === "TOKEN_REFRESHED"
      ) {
        if (!u) {
          if (mounted) setUser(null);
          return;
        }
        getDisplayName().then((name) => {
          if (!mounted) return;
          setUser({
            id: u.id,
            email: u.email ?? "",
            username: name ?? u.user_metadata?.full_name ?? undefined,
          });
        });
      } else if (event === "SIGNED_OUT") {
        if (mounted) setUser(null);
      }
    });

    getCurrentUser()
      .then(setUser)
      .catch(() => {})
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
      subscription.data.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
