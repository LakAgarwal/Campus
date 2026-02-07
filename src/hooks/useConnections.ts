import { useState, useEffect } from 'react';
<<<<<<< HEAD
import { api } from '@/api/client';
=======
>>>>>>> 0ac01baa4c622dfc7d74ff1260d588d67ffd0325
import { useAuth } from './useAuth';

export type ConnectionStatus = 'pending' | 'accepted' | 'rejected' | null;

interface Connection {
  connection_id: number;
  user1_id: string;
  user2_id: string;
  status: ConnectionStatus;
  created_at: string;
}

interface UseConnectionsReturn {
  connections: Connection[];
  pendingSent: Connection[];
  pendingReceived: Connection[];
  connectedUsers: Connection[];
  isLoading: boolean;
  error: Error | null;
  sendConnectionRequest: (userId: string) => Promise<void>;
  acceptConnection: (connectionId: number) => Promise<void>;
  rejectConnection: (connectionId: number) => Promise<void>;
  getConnectionStatus: (userId: string) => ConnectionStatus;
}

export const useConnections = (): UseConnectionsReturn => {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  const fetchConnections = async () => {
    if (!user) return;
    try {
      setIsLoading(true);
<<<<<<< HEAD
      const data = await api.get<Connection[]>('/connections').catch(() => []);
      setConnections(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch connections'));
=======
      setConnections([]);
>>>>>>> 0ac01baa4c622dfc7d74ff1260d588d67ffd0325
    } finally {
      setIsLoading(false);
    }
  };

<<<<<<< HEAD
  const sendConnectionRequest = async (userId: string) => {
    if (!user) return;
    try {
      await api.post('/connections', {
        user1_id: user.id,
        user2_id: userId,
        status: 'pending'
      });
      await fetchConnections();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to send connection request'));
      throw err;
    }
  };

  const acceptConnection = async (connectionId: number) => {
    try {
      await api.patch('/connections/' + connectionId, { status: 'accepted' });
      await fetchConnections();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to accept connection'));
      throw err;
    }
  };

  const rejectConnection = async (connectionId: number) => {
    try {
      await api.delete('/connections/' + connectionId);
      await fetchConnections();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to reject connection'));
      throw err;
    }
  };

  const getConnectionStatus = (userId: string): ConnectionStatus => {
    if (!user) return null;
    const connection = connections.find(
      conn =>
        (conn.user1_id === user.id && conn.user2_id === userId) ||
        (conn.user1_id === userId && conn.user2_id === user.id)
    );
    return connection?.status ?? null;
  };

  const pendingSent = connections.filter(conn => conn.user1_id === user?.id && conn.status === 'pending');
  const pendingReceived = connections.filter(conn => conn.user2_id === user?.id && conn.status === 'pending');
  const connectedUsers = connections.filter(conn => conn.status === 'accepted');

  useEffect(() => {
    fetchConnections();
  }, [user?.id]);
=======
  const sendConnectionRequest = async (_userId: string) => {
    if (!user) return;
    await fetchConnections();
  };

  const acceptConnection = async (_connectionId: number) => {
    await fetchConnections();
  };

  const rejectConnection = async (_connectionId: number) => {
    await fetchConnections();
  };

  // Get connection status with another user
  const getConnectionStatus = (userId: string): ConnectionStatus => {
    if (!user) return null;

    const connection = connections.find(
      conn => 
        (conn.user1_id === user.id && conn.user2_id === userId) ||
        (conn.user1_id === userId && conn.user2_id === user.id)
    );

    return connection?.status || null;
  };

  // Filter connections based on status
  const pendingSent = connections.filter(
    conn => conn.user1_id === user?.id && conn.status === 'pending'
  );

  const pendingReceived = connections.filter(
    conn => conn.user2_id === user?.id && conn.status === 'pending'
  );

  const connectedUsers = connections.filter(
    conn => conn.status === 'accepted'
  );

  // Fetch connections on mount and when user changes
  useEffect(() => {
    fetchConnections();
  }, [user]);
>>>>>>> 0ac01baa4c622dfc7d74ff1260d588d67ffd0325

  return {
    connections,
    pendingSent,
    pendingReceived,
    connectedUsers,
    isLoading,
    error,
    sendConnectionRequest,
    acceptConnection,
    rejectConnection,
    getConnectionStatus
  };
<<<<<<< HEAD
};
=======
}; 
>>>>>>> 0ac01baa4c622dfc7d74ff1260d588d67ffd0325
