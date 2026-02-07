import { useState, useEffect } from 'react';
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
      setConnections([]);
    } finally {
      setIsLoading(false);
    }
  };

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
}; 
