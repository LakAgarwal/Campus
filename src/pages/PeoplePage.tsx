import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowLeft } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
<<<<<<< HEAD
import { api } from '@/api/client';
=======
import { apiFetch } from '@/lib/api';
import { getStoredUserId } from '@/lib/api';
>>>>>>> 0ac01baa4c622dfc7d74ff1260d588d67ffd0325
import { useAuth } from '@/hooks/useAuth';
import UserCard from '@/components/users/UserCard';
import { useConnections } from "@/hooks/useConnections";

export interface UserProfile {
  id: string;
  full_name: string;
  username: string;
  year_of_study: number;
  branch: string;
  optional?: {
    // Added optional property
    skills?: string;
    bio?: string;
    contact_info?: string;
    projects?: string;
    social_media_links?: string;
    volunteering_exp?: string;
    profile_picture_url?: string;
  };
  preferences?: Record<string, any>;
}

const PeoplePage: React.FC = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const { sendConnectionRequest, acceptConnection, rejectConnection } = useConnections();

  const categories = [
    "Web Development", "Mobile Development", "UI/UX Design", "Data Science",
    "Machine Learning", "Cloud Computing", "DevOps", "Cybersecurity",
    "Blockchain", "Game Development", "AR/VR", "IoT"
  ];

  const fetchUsers = async () => {
    try {
      setLoading(true);
<<<<<<< HEAD
      if (!user?.id) {
=======
      const userId = getStoredUserId();
      if (!userId || !user?.id) {
>>>>>>> 0ac01baa4c622dfc7d74ff1260d588d67ffd0325
        toast({
          title: "Authentication required",
          description: "Please sign in to view users",
          variant: "destructive",
        });
        navigate('/signin');
        return;
      }

<<<<<<< HEAD
      const allProfiles = await api.get<UserProfile[]>('/profiles') || [];
      const profilesData = allProfiles.filter((p: UserProfile) => p.id !== user.id && !(p as UserProfile & { is_deleted?: boolean }).is_deleted);

      if (!profilesData.length) {
=======
      const res = await apiFetch<UserProfile[]>("/profiles");
      if (res.error || !res.data || !Array.isArray(res.data)) {
>>>>>>> 0ac01baa4c622dfc7d74ff1260d588d67ffd0325
        setUsers([]);
        setFilteredUsers([]);
        return;
      }

<<<<<<< HEAD
      const enrichedProfiles = await Promise.all(profilesData.map(async (profile: UserProfile) => {
        const optionalRes = await api.get<unknown>(`/profiles/${profile.id}/optional`);
        const optional = Array.isArray(optionalRes) ? undefined : (optionalRes as UserProfile['optional']);
        const preferencesRes = await api.get<{ preference: string }[]>(`/profiles/${profile.id}/preferences`);
        const preferences = preferencesRes;
        return {
          ...profile,
          optional: optional ? {
            ...optional,
            skills: optional?.skills || '',
            bio: optional?.bio || '',
            contact_info: optional?.contact_info || '',
            projects: optional?.projects || '',
            social_media_links: optional?.social_media_links || '',
            volunteering_exp: optional?.volunteering_exp || '',
            profile_picture_url: optional?.profile_picture_url || ''
          },
          preferences: (preferences || []).reduce((acc: Record<string, boolean>, p) => ({ ...acc, [p.preference]: true }), {})
        };
=======
      const allProfiles = res.data as Array<Record<string, unknown>>;
      const profilesData = allProfiles.filter((p) => (p.id ?? p.profile_id) !== user.id);

      const enrichedProfiles: UserProfile[] = profilesData.map((profile) => ({
        id: (profile.id as string) ?? String(profile.profile_id),
        full_name: (profile.full_name as string) ?? "",
        username: (profile.username as string) ?? "",
        year_of_study: (profile.year_of_study as number) ?? 0,
        branch: (profile.branch as string) ?? "",
        optional: {},
        preferences: {},
>>>>>>> 0ac01baa4c622dfc7d74ff1260d588d67ffd0325
      }));

      setUsers(enrichedProfiles);
      setFilteredUsers(enrichedProfiles);
<<<<<<< HEAD
    } catch (error) {
      console.error('Error fetching users:', error);
=======
    } catch {
>>>>>>> 0ac01baa4c622dfc7d74ff1260d588d67ffd0325
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      fetchUsers();
    }
  }, [user?.id, navigate, toast, authLoading]);

  useEffect(() => {
    let filtered = [...users];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          user.full_name.toLowerCase().includes(query) ||
          user.branch.toLowerCase().includes(query) ||
          user.optional?.skills
            ?.split(",")
            .some((skill) => skill.toLowerCase().includes(query)) // Fixed here
      );
    }

    // Apply category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((user) =>
        user.optional?.skills
          ?.split(",")
          .some((skill) => selectedCategories.includes(skill))
      );
    }


    setFilteredUsers(filtered);
  }, [searchQuery, selectedCategories, users]);

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 py-8">
        <div className="container max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Authentication Required</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Please sign in to view and connect with other users.
          </p>
          <Button onClick={() => navigate('/signin')}>
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="container max-w-7xl mx-auto px-4">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-6 flex items-center gap-2"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4" />
          Go Back
        </Button>

        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Like-Minded People</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Connect with students who share your interests and skills. Find your perfect study buddies and project collaborators.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-12 space-y-6">
          <div className="relative max-w-2xl mx-auto">
            <Input
              type="search"
              placeholder="Search by name, branch, or skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 h-12 text-lg"
            />
            <svg
              className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategories.includes(category) ? "default" : "outline"}
                className="cursor-pointer px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                onClick={() => toggleCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>

        {/* User Grid */}
        {filteredUsers.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-block p-4 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
              <svg
                className="h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No users found</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              Try adjusting your search criteria or category filters to find more matches.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredUsers.map((user) => (
              <UserCard
                key={user.id}
                user={user}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PeoplePage;
