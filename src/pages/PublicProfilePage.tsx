import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
<<<<<<< HEAD
import { api } from "@/api/client";
=======
import { apiFetch } from "@/lib/api";
>>>>>>> 0ac01baa4c622dfc7d74ff1260d588d67ffd0325
import { Profile } from "@/types/profileTypes";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  BookOpen, 
  GraduationCap, 
  Link2, 
  Briefcase, 
  Heart,
  Globe,
  User
} from "lucide-react";

interface PublicProfile extends Omit<Profile, 'blood_group' | 'roll_number'> {
  optional?: {
    bio?: string;
    skills?: string;
    projects?: string;
    volunteering_exp?: string;
    social_media_links?: string;
    profile_picture_url?: string;
  };
  preferences?: string[];
}

const PublicProfilePage = () => {
  const { username } = useParams<{ username: string }>();
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
<<<<<<< HEAD
      try {
        setLoading(true);
        
        const profileData = await api.get<Profile & { profile_id?: number }>('/profiles/username/' + username);
=======
      if (!username) return;
      try {
        setLoading(true);
        const res = await apiFetch<Array<Profile & Record<string, unknown>>>("/profiles");
        if (!res.data || !Array.isArray(res.data)) {
          setProfile(null);
          return;
        }
        const profileData = (res.data as Array<Profile & Record<string, unknown>>).find(
          (p) => (p.username ?? (p as Record<string, unknown>).username) === username
        );
>>>>>>> 0ac01baa4c622dfc7d74ff1260d588d67ffd0325
        if (!profileData) {
          setProfile(null);
          return;
        }
<<<<<<< HEAD
        const optionalRes = await api.get<PublicProfile['optional']>('/profiles/' + profileData.id + '/optional');
        const optionalData = Array.isArray(optionalRes) ? undefined : optionalRes;
        const preferencesData = await api.get<{ preference: string }[]>('/profiles/' + profileData.id + '/preferences') || [];
        setProfile({
          ...profileData,
          is_deleted: false,
          optional: optionalData || {},
          preferences: preferencesData.map(p => p.preference)
        });

      } catch (error) {
        console.error('Error fetching profile:', error);
=======
        setProfile({
          ...(profileData as Profile),
          optional: {},
          preferences: [],
        });
      } catch {
        setProfile(null);
>>>>>>> 0ac01baa4c622dfc7d74ff1260d588d67ffd0325
      } finally {
        setLoading(false);
      }
    };

<<<<<<< HEAD
    if (username) {
      fetchProfile();
    }
=======
    fetchProfile();
>>>>>>> 0ac01baa4c622dfc7d74ff1260d588d67ffd0325
  }, [username]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse text-xl text-primary">Loading profile...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl text-gray-600">Profile not found</div>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Header/Banner Section */}
          <div className="h-32 bg-gradient-to-r from-primary/10 to-secondary/10" />
          
          {/* Profile Info Section */}
          <div className="px-6 py-8">
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
              <div className="-mt-20 md:-mt-16">
                <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
                  {profile.optional?.profile_picture_url ? (
                    <AvatarImage 
                      src={profile.optional.profile_picture_url} 
                      alt={profile.full_name} 
                    />
                  ) : (
                    <AvatarFallback className="text-4xl bg-primary/10 text-primary">
                      {getInitials(profile.full_name)}
                    </AvatarFallback>
                  )}
                </Avatar>
              </div>

              <div className="flex-1 text-center md:text-left">
                <h1 className="text-2xl font-bold">{profile.full_name}</h1>
                <p className="text-gray-600">@{profile.username}</p>
                
                <div className="flex flex-wrap gap-2 mt-3 justify-center md:justify-start">
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <GraduationCap className="h-3 w-3" />
                    Year {profile.year_of_study}
                  </Badge>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <BookOpen className="h-3 w-3" />
                    {profile.branch}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Bio Section */}
            {profile.optional?.bio && (
              <div className="mt-6">
                <p className="text-gray-700">{profile.optional.bio}</p>
              </div>
            )}

            {/* Skills Section */}
            {profile.optional?.skills && (
              <div className="mt-6">
                <h2 className="text-lg font-semibold mb-3">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {profile.optional.skills.split(',').map((skill, index) => (
                    <Badge key={index} variant="outline">
                      {skill.trim()}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <Separator className="my-6" />

            {/* Projects & Experience */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {profile.optional?.projects && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Briefcase className="h-5 w-5 text-primary" />
                      Projects
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {profile.optional.projects}
                    </p>
                  </CardContent>
                </Card>
              )}

              {profile.optional?.volunteering_exp && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Heart className="h-5 w-5 text-primary" />
                      Volunteering
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {profile.optional.volunteering_exp}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Interests/Preferences */}
            {profile.preferences && profile.preferences.length > 0 && (
              <div className="mt-6">
                <h2 className="text-lg font-semibold mb-3">Interests</h2>
                <div className="flex flex-wrap gap-2">
                  {profile.preferences.map((preference, index) => (
                    <Badge key={index} variant="secondary">
                      {preference}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Social Links */}
            {profile.optional?.social_media_links && (
              <div className="mt-6">
                <h2 className="text-lg font-semibold mb-3">Connect</h2>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-primary" />
                  <a 
                    href={profile.optional.social_media_links}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Social Profile
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicProfilePage;