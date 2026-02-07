import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
<<<<<<< HEAD
import { api } from '@/api/client';
import { useAuth } from '@/hooks/useAuth';

interface Connection {
  connection_id?: number;
  connectionId?: number;
  user1_id?: string;
  user2_id?: string;
  user1Id?: string;
  user2Id?: string;
=======
import { useAuth } from '@/hooks/useAuth';

interface Connection {
  user1_id: string;
  user2_id: string;
>>>>>>> 0ac01baa4c622dfc7d74ff1260d588d67ffd0325
  status: string;
}

interface Profile {
  id: string;
  full_name: string;
  username: string;
  year_of_study: number;
  branch: string;
  profile_picture_url?: string;
}

interface PendingUser {
  id: string;
  full_name: string;
  username: string;
  year_of_study: number;
  branch: string;
  profile_picture_url?: string;
  isSentRequest: boolean;
}

const PendingConnections: React.FC = () => {
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<PendingUser | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchPendingConnections = async () => {
    try {
      if (!user?.id) {
        setLoading(false);
        return;
      }

<<<<<<< HEAD
      const connections = await api.get<Connection[]>('/connections').catch(() => []);
      const list = Array.isArray(connections) ? connections : [];
      const pending = list.filter(c => c.status === 'pending');
      if (pending.length === 0) {
        setPendingUsers([]);
        setLoading(false);
        return;
      }
      const userIds = pending.map(conn => {
        const u1 = (conn as { user1_id?: string; user1Id?: string }).user1_id ?? (conn as { user1Id?: string }).user1Id;
        const u2 = (conn as { user2_id?: string; user2Id?: string }).user2_id ?? (conn as { user2Id?: string }).user2Id;
        return u1 === user.id ? u2 : u1;
      });
      const profiles = await Promise.all(userIds.map(id => api.get<Profile>(`/profiles/${id}`).catch(() => null)));
      const connList = pending as (Connection & { connection_id?: number; connectionId?: number })[];
      const pendingUsersList = profiles.filter(Boolean).map((profile, i) => {
        const conn = connList.find(c => {
          const u1 = (c as { user1_id?: string }).user1_id ?? (c as { user1Id?: string }).user1Id;
          const u2 = (c as { user2_id?: string }).user2_id ?? (c as { user2Id?: string }).user2Id;
          return u1 === (profile as Profile).id || u2 === (profile as Profile).id;
        });
        return {
          id: (profile as Profile).id,
          full_name: (profile as Profile).full_name,
          username: (profile as Profile).username,
          year_of_study: (profile as Profile).year_of_study,
          branch: (profile as Profile).branch,
          profile_picture_url: (profile as Profile).profile_picture_url,
          isSentRequest: conn ? ((conn as { user1_id?: string }).user1_id ?? (conn as { user1Id?: string }).user1Id) === user.id : false
        };
      });
      setPendingUsers(pendingUsersList);
=======
      setPendingUsers([]);
>>>>>>> 0ac01baa4c622dfc7d74ff1260d588d67ffd0325
    } catch (error) {
      console.error('Error fetching pending connections:', error);
      toast({
        title: "Error",
        description: "Failed to fetch pending connections",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingConnections();
  }, [user?.id]);

  const handleAccept = async (userId: string) => {
    try {
<<<<<<< HEAD
      const connections = await api.get<{ connection_id?: number; connectionId?: number; user1_id?: string; user2_id?: string; status: string }[]>('/connections').catch(() => []);
      const conn = Array.isArray(connections) ? connections.find(c => c.status === 'pending' && (c.user1_id === userId && c.user2_id === user?.id || c.user2_id === userId && c.user1_id === user?.id)) : null;
      const connectionId = conn?.connection_id ?? conn?.connectionId;
      if (connectionId == null) throw new Error('Connection not found');
      await api.patch(`/connections/${connectionId}`, { status: 'accepted' });

      // Remove user from pending list
=======
>>>>>>> 0ac01baa4c622dfc7d74ff1260d588d67ffd0325
      setPendingUsers(prev => prev.filter(u => u.id !== userId));

      toast({
        title: "Connection accepted",
        description: "You are now connected with this user",
      });
    } catch (error) {
      console.error('Error accepting connection:', error);
      toast({
        title: "Error",
        description: "Failed to accept connection",
        variant: "destructive",
      });
    }
  };

  const handleReject = async (userId: string) => {
    try {
<<<<<<< HEAD
      const connections = await api.get<{ connection_id?: number; connectionId?: number; user1_id?: string; user2_id?: string; status: string }[]>('/connections').catch(() => []);
      const conn = Array.isArray(connections) ? connections.find(c => c.status === 'pending' && (c.user1_id === userId && c.user2_id === user?.id || c.user2_id === userId && c.user1_id === user?.id)) : null;
      const connectionId = conn?.connection_id ?? conn?.connectionId;
      if (connectionId == null) throw new Error('Connection not found');
      await api.delete(`/connections/${connectionId}`);

      // Remove user from pending list
=======
>>>>>>> 0ac01baa4c622dfc7d74ff1260d588d67ffd0325
      setPendingUsers(prev => prev.filter(u => u.id !== userId));

      toast({
        title: "Connection rejected",
        description: "Connection request has been rejected",
      });
    } catch (error) {
      console.error('Error rejecting connection:', error);
      toast({
        title: "Error",
        description: "Failed to reject connection",
        variant: "destructive",
      });
    } finally {
      setRejectDialogOpen(false);
      setSelectedUser(null);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user?.id) {
    return (
      <div className="text-center py-8 text-gray-500">
        Please sign in to view pending connections
      </div>
    );
  }

  if (pendingUsers.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No pending connection requests
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {pendingUsers.map((pendingUser) => (
        <Card key={pendingUser.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  {pendingUser.profile_picture_url ? (
                    <AvatarImage src={pendingUser.profile_picture_url} alt={pendingUser.full_name} />
                  ) : (
                    <AvatarFallback>{getInitials(pendingUser.full_name)}</AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <h3 className="font-semibold">{pendingUser.full_name}</h3>
                  <p className="text-sm text-gray-500">
                    Year {pendingUser.year_of_study} • {pendingUser.branch}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => navigate(`/profile/${pendingUser.username}`)}
                >
                  View Profile
                </Button>
                {pendingUser.isSentRequest ? (
                  <Button variant="secondary" disabled>
                    Waiting
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="default"
                      onClick={() => handleAccept(pendingUser.id)}
                    >
                      Accept
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        setSelectedUser(pendingUser);
                        setRejectDialogOpen(true);
                      }}
                    >
                      Reject
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      <AlertDialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Connection Request</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reject the connection request from {selectedUser?.full_name}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => selectedUser && handleReject(selectedUser.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Reject
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PendingConnections; 