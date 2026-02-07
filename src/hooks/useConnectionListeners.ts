import { useEffect } from 'react';

export function useConnectionListener() {
  useEffect(() => {
    return () => {};
  }, []);
}
