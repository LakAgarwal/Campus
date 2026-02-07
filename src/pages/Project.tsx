import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProjectDetails from "@/components/ProjectDetails";
import { api, getCurrentUserId } from "@/api/client";
import { ProjectData } from "@/types/project";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const Project = () => {
  const { opening_id } = useParams<{ opening_id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [projectData, setProjectData] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [joinStatus, setJoinStatus] = useState<'Owner' | 'Already Joined' | 'Active' | null>(null);

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        if (!opening_id) {
          throw new Error("Project ID is required");
        }

        setLoading(true);

        const userId = getCurrentUserId();
        if (!userId) throw new Error("User not authenticated");

        const opening = await api.get<{
          opening_id: number; openingId?: number; created_by: string; title: string; short_description: string;
          category: string; long_description: string; eligibility: string; contact: string;
          profiles?: { id: string; full_name: string; username: string; branch: string; year_of_study: number; profile_optional?: unknown };
          opening_records?: unknown; opening_optional_details?: unknown; opening_media?: unknown; opening_links?: unknown;
        }>('/openings/' + opening_id);

        if (!opening) throw new Error("Project not found");

        const openingId = opening.opening_id ?? (opening as { openingId?: number }).openingId ?? 0;
        let resolvedJoinStatus: 'Owner' | 'Already Joined' | 'Active' | null = null;
        if (opening.created_by === userId) {
          resolvedJoinStatus = 'Owner';
          setJoinStatus('Owner');
        } else {
          const members = await api.get<{ user_id: string }[]>('/openings/' + opening_id + '/members').catch(() => []);
          const existingMember = members?.find((m: { user_id: string }) => m.user_id === userId);
          resolvedJoinStatus = existingMember ? 'Already Joined' : 'Active';
          setJoinStatus(resolvedJoinStatus);
        }

        const creator = opening.profiles ? {
          id: opening.profiles.id,
          full_name: opening.profiles.full_name,
          username: opening.profiles.username,
          branch: opening.profiles.branch,
          year_of_study: opening.profiles.year_of_study,
          profile_optional: opening.profiles.profile_optional
        } : { id: opening.created_by, full_name: '', username: '', branch: '', year_of_study: 0, profile_optional: undefined };

        const formattedProjectData: ProjectData = {
          opening: {
            opening_id: openingId,
            created_by: opening.created_by,
            title: opening.title,
            short_description: opening.short_description,
            category: opening.category,
            long_description: opening.long_description,
            eligibility: opening.eligibility,
            contact: opening.contact,
            creator
          },
          records: opening.opening_records || undefined,
          optionalDetails: opening.opening_optional_details || undefined,
          media: opening.opening_media || undefined,
          links: opening.opening_links || undefined,
          participantStatus: resolvedJoinStatus === 'Already Joined' ? 'Accepted' : null
        };

        setProjectData(formattedProjectData);
      } catch (err: unknown) {
        console.error("Error fetching project data:", err);
        setError(err instanceof Error ? err.message : "Failed to load project data.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjectData();
  }, [opening_id]);

  const handleJoinProject = async () => {
    try {
      const userId = getCurrentUserId();
      if (!userId) throw new Error("User not authenticated");

      await api.post('/openings/' + opening_id + '/join', {});

      setJoinStatus('Already Joined');
      toast({
        title: "Successfully joined project",
        description: "You have joined this project successfully.",
      });
    } catch (error: unknown) {
      console.error("Error joining project:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to join project. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="w-10 h-10 rounded-full border-4 border-primary border-t-transparent mx-auto animate-spin"></div>
          <p className="text-muted-foreground">Loading project details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md p-6 text-center space-y-4">
          <h2 className="text-2xl font-semibold">Something went wrong</h2>
          <p className="text-muted-foreground">{error}</p>
          <Button variant="outline" onClick={() => navigate(-1)} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Go back
          </Button>
        </div>
      </div>
    );
  }

  if (!projectData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md p-6 text-center space-y-4">
          <h2 className="text-2xl font-semibold">Project not found</h2>
          <p className="text-muted-foreground">
            The project you are looking for doesn't exist or has been removed.
          </p>
          <Button variant="outline" onClick={() => navigate(-1)} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Go back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <ProjectDetails 
        projectData={projectData} 
        joinStatus={joinStatus}
        onJoin={handleJoinProject}
      />
    </div>
  );
};

export default Project;
