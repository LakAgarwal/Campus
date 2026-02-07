<<<<<<< HEAD
import { useEffect, useState } from 'react';
import { getAuthToken, getCurrentUserId, authSession, clearAuthToken, type AuthUser } from '@/api/client';

export interface SessionUser extends AuthUser {
  id: string;
  email?: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getAuthToken();
    const userId = getCurrentUserId();
    if (!token || !userId) {
      setUser(null);
      setLoading(false);
      return;
    }
    setUser({ id: userId });
    authSession()
      .then(({ session }) => {
        if (session?.user) {
          setUser({ id: session.user.id, email: session.user.email });
        }
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const setSessionUser = (u: SessionUser | null) => {
    setUser(u);
  };

  const signOut = () => {
    clearAuthToken();
    setUser(null);
  };

  return { user, loading, setSessionUser, signOut };
};
=======
import { useAuthContext } from "@/contexts/AuthContext";

export function useAuth() {
  const { user, loading, signIn, signUp, signOut, hasSession } = useAuthContext();
  return {
    user: user ? { id: user.id, email: user.email } : null,
    loading,
    signIn,
    signUp,
    signOut,
    hasSession,
  };
}
>>>>>>> 0ac01baa4c622dfc7d74ff1260d588d67ffd0325
