import { useEffect, useState } from 'react';
import { getAuthToken, getCurrentUserId, clearAuthToken } from '@/api/client';

export interface AuthUser {
  id: string;
  email?: string;
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getAuthToken();
    const userId = getCurrentUserId();
    if (!token || !userId) {
      setUser(null);
    } else {
      setUser({ id: userId });
    }
    setLoading(false);
  }, []);

  const signOut = () => {
    clearAuthToken();
    setUser(null);
  };

  return {
    user,
    loading,
    signOut,
  };
}
