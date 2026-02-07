import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, Users, Clock, MessageSquare, Check, X, XCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import Sidebar from "@/components/homepage/Sidebar";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/api/client";
import PendingConnections from '@/components/users/PendingConnections';
import ConnectedUsers from '@/components/users/ConnectedUsers';
import ProjectCard from '@/components/projects/ProjectCard';
import { useToast } from "@/hooks/use-toast";

interface Project {
  opening_id: string;
  title: string;
  short_description: string;
  category: string;
  memberCount: number;
  role: 'Owner' | 'Member';
}

const ProjectsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("projects");
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobileView(mobile);
      setIsSidebarExpanded(window.innerWidth >= 1024);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        
        const openingsList = await api.get<{ opening_id?: number; openingId?: number; title: string; short_description: string; category: string; created_by: string }[]>('/openings') || [];
        const myOpenings = openingsList.filter((o: { created_by: string }) => o.created_by === user?.id);
        const ownedProjects = myOpenings.map((o: { opening_id?: number; openingId?: number; title: string; short_description: string; category: string }) => ({
          opening_id: o.opening_id ?? (o as { openingId?: number }).openingId ?? 0,
          title: o.title,
          short_description: o.short_description,
          category: o.category
        }));
        const memberProjects: { opening_id: number }[] = [];
        const allProjectIds = [...(ownedProjects?.map((p: { opening_id: number }) => p.opening_id) || []), ...(memberProjects?.map((p: { opening_id: number }) => p.opening_id) || [])];
        const memberCountMap: Record<number, number> = {};
        for (const id of allProjectIds) {
          try {
            const members = await api.get<unknown[]>(`/openings/${id}/members`) || [];
            memberCountMap[id] = members.length;
          } catch {
            memberCountMap[id] = 0;
          }
        }

        // Format owned projects
        const formattedOwnedProjects = ownedProjects?.map(project => ({
          opening_id: project.opening_id,
          title: project.title,
          short_description: project.short_description,
          category: project.category,
          memberCount: memberCountMap[project.opening_id] || 1,
          role: 'Owner' as const
        })) || [];

        // Format member projects
        const formattedMemberProjects = memberProjects?.map(project => {
          const openings = project.openings as any;
          return {
            opening_id: project.opening_id,
            title: openings.title,
            short_description: openings.short_description,
            category: openings.category,
            memberCount: memberCountMap[project.opening_id] || 1,
            role: 'Member' as const
          };
        }) || [];

        // Combine and deduplicate projects
        const allProjects = [...formattedOwnedProjects, ...formattedMemberProjects];
        const uniqueProjects = Array.from(
          new Map(allProjects.map(project => [project.opening_id, project])).values()
        );

        setProjects(uniqueProjects);
      } catch (error: any) {
        console.error('Error fetching projects:', error);
        toast({
          title: "Error",
          description: "Failed to load projects. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProjects();
    }
  }, [user]);

  // Filter projects based on search query
  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.short_description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar
        isSidebarExpanded={isSidebarExpanded}
        setIsSidebarExpanded={setIsSidebarExpanded}
        isMobileView={isMobileView}
        handleLogout={signOut}
      />
        
      <div className="max-w-[1200px] mx-auto z-10 px-4 sm:px-6 pt-20 pb-10">
        <Navbar />
        
        <div className="space-y-6">
          {/* Back Button */}
          <Button
            variant="ghost"
            className="mb-4"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          {/* Header Section */}
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  Collaborations
                </h1>
                <p className="text-muted-foreground mt-1">
                  Find and manage your collaboration projects and connections
                </p>
              </div>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create Project
              </Button>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search projects by title, description, or category..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Tabs Navigation */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="projects" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Projects
              </TabsTrigger>
              <TabsTrigger value="people" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                People
              </TabsTrigger>
              <TabsTrigger value="pending" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Pending
              </TabsTrigger>
            </TabsList>

            {/* Projects Tab Content */}
            <TabsContent value="projects" className="space-y-4">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-[300px] rounded-xl border bg-card animate-pulse" />
                  ))}
                </div>
              ) : filteredProjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <AnimatePresence>
                    {filteredProjects.map((project) => (
                      <ProjectCard key={project.opening_id} project={project} />
                    ))}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="text-muted-foreground mb-2">
                    <Users size={48} className="mx-auto mb-4 text-primary/30" />
                  </div>
                  <h3 className="text-xl font-medium mb-1">No projects found</h3>
                  <p className="text-muted-foreground mb-6">
                    {searchQuery 
                      ? "Try adjusting your search query"
                      : "You haven't joined or created any projects yet"}
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/openings')}
                    className="bg-transparent border-primary/20 text-primary hover:bg-primary/5"
                  >
                    Browse Projects
                  </Button>
                </div>
              )}
            </TabsContent>

            {/* People Tab Content */}
            <TabsContent value="people" className="space-y-4">
              <div className="space-y-6">
                <ConnectedUsers />
              </div>
            </TabsContent>

            {/* Pending Tab Content */}
            <TabsContent value="pending" className="space-y-4">
              <div className="space-y-6">
                <PendingConnections />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;
