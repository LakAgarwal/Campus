import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import {
  getStoredUserId,
  getToken,
  removeToken,
  setToken,
  signIn as apiSignIn,
  signUp as apiSignUp,
  SignInRequest,
  SignUpRequest,
} from "@/lib/api";

export interface AuthUser {
  id: string;
  email: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  signIn: (req: SignInRequest) => Promise<{ error?: string }>;
  signUp: (req: SignUpRequest) => Promise<{ error?: string }>;
  signOut: () => void;
  hasSession: () => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const loadSession = useCallback(() => {
    const token = getToken();
    const userId = getStoredUserId();
    const email = localStorage.getItem("club_scheduler_user_email");
    if (token && userId) {
      setUser({ id: userId, email: email || "" });
    } else {
      setUser(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  const signIn = useCallback(
    async (req: SignInRequest) => {
      const res = await apiSignIn(req);
      if (res.error || !res.data) {
        return { error: res.error || "Sign in failed" };
      }
      const d = res.data;
      setToken(d.token, d.user_id, d.email);
      setUser({ id: d.user_id, email: d.email });
      return {};
    },
    []
  );

  const signUp = useCallback(
    async (req: SignUpRequest) => {
      const res = await apiSignUp(req);
      if (res.error || !res.data) {
        return { error: res.error || "Sign up failed" };
      }
      const d = res.data;
      setToken(d.token, d.user_id, d.email);
      setUser({ id: d.user_id, email: d.email });
      return {};
    },
    []
  );

  const signOut = useCallback(() => {
    removeToken();
    setUser(null);
  }, []);

  const hasSession = useCallback(() => {
    return !!getToken() && !!getStoredUserId();
  }, []);

  const value: AuthContextValue = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    hasSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used within AuthProvider");
  return ctx;
}
