import { useEffect } from 'react';
import { api } from '@/api/client';

export function useEventRegistrationListener() {
  useEffect(() => {
    // Realtime subscriptions removed; use polling or backend webhooks if needed
    return () => {};
  }, []);
}
