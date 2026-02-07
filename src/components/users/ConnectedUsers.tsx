import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, MessageSquare } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
<<<<<<< HEAD
import { api } from '@/api/client';
=======
>>>>>>> 0ac01baa4c622dfc7d74ff1260d588d67ffd0325
import { useAuth } from '@/hooks/useAuth';

interface ConnectedUser {
  id: string;
  full_name: string;
  username: string;
  year_of_study: number;
  branch: string;
  profile_picture_url?: string;
}

const ConnectedUsers: React.FC = () => {
  const [connectedUsers, setConnectedUsers] = useState<ConnectedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchConnectedUsers = async () => {
    try {
      if (!user?.id) {
        setLoading(false);
        return;
      }

<<<<<<< HEAD
      const connections = await api.get<{ user1_id: string; user2_id: string; user1Id?: string; user2Id?: string; status: string }[]>('/connections').catch(() => []);
      const list = Array.isArray(connections) ? connections : [];
      const accepted = list.filter(c => c.status === 'accepted');
      const userIds = accepted.map(c => {
        const u1 = c.user1_id ?? (c as { user1Id?: string }).user1Id;
        const u2 = c.user2_id ?? (c as { user2Id?: string }).user2Id;
        return u1 === user.id ? u2 : u1;
      });
      if (userIds.length === 0) {
        setConnectedUsers([]);
        setLoading(false);
        return;
      }
      const profiles = await Promise.all(userIds.map(id => api.get<ConnectedUser>(`/profiles/${id}`).catch(() => null)));
      const connectedUsersList = profiles.filter(Boolean) as ConnectedUser[];
      setConnectedUsers(connectedUsersList.map(p => ({
        id: p.id,
        full_name: (p as { full_name?: string }).full_name ?? (p as { fullName?: string }).fullName ?? '',
        username: (p as { username?: string }).username ?? '',
        year_of_study: (p as { year_of_study?: number }).year_of_study ?? (p as { yearOfStudy?: number }).yearOfStudy ?? 0,
        branch: (p as { branch?: string }).branch ?? '',
        profile_picture_url: (p as { profile_picture_url?: string }).profile_picture_url ?? (p as { profilePictureUrl?: string }).profilePictureUrl
      })));
=======
      setConnectedUsers([]);
>>>>>>> 0ac01baa4c622dfc7d74ff1260d588d67ffd0325
    } catch (error) {
      console.error('Error fetching connected users:', error);
      toast({
        title: "Error",
        description: "Failed to fetch connected users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConnectedUsers();
  }, [user?.id]);

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
        Please sign in to view connected users
      </div>
    );
  }

  if (connectedUsers.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No connected users yet
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {connectedUsers.map((connectedUser) => (
        <Card key={connectedUser.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  {connectedUser.profile_picture_url ? (
                    <AvatarImage src={connectedUser.profile_picture_url} alt={connectedUser.full_name} />
                  ) : (
                    <AvatarFallback>{getInitials(connectedUser.full_name)}</AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <h3 className="font-semibold">{connectedUser.full_name}</h3>
                  <p className="text-sm text-gray-500">
                    Year {connectedUser.year_of_study} • {connectedUser.branch}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => navigate(`/profile/${connectedUser.username}`)}
                >
                  View Profile
                </Button>
                <Button
                  variant="default"
                  onClick={() => navigate(`/messages/${connectedUser.id}`)}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Message
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ConnectedUsers; 