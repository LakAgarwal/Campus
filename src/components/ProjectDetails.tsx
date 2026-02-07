import React, { useState } from "react";
import { JoinStatus, OpeningOptionalDetail, ProjectData } from "@/types/project";
import { Button } from "@/components/ui/button";
import ProjectHeader from "@/components/ui/ProjectHeader";
import ProjectTimeline from "@/components/ui/ProjectTimeline";
import ProjectGallery from "@/components/ui/ProjectGallery";
import ProjectLinks from "@/components/ui/ProjectLinks";
import { 
  Calendar,
  ChevronDown, 
  ChevronUp,
  Clock, 
  FileText, 
  List,
  User,
<<<<<<< HEAD
  Users,
  CheckCircle2,
  ArrowLeft
=======
  Users 
>>>>>>> 0ac01baa4c622dfc7d74ff1260d588d67ffd0325
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
<<<<<<< HEAD
import { useNavigate } from "react-router-dom";

interface ProjectDetailsProps {
  projectData: ProjectData;
  joinStatus: 'Owner' | 'Already Joined' | 'Active' | null;
  onJoin: () => Promise<void>;
}

const ProjectDetails: React.FC<ProjectDetailsProps> = ({ projectData, joinStatus, onJoin }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showFullDescription, setShowFullDescription] = useState(false);
=======

interface ProjectDetailsProps {
  projectData: ProjectData;
}

const ProjectDetails: React.FC<ProjectDetailsProps> = ({ projectData }) => {
  const { toast } = useToast();
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [joinStatus, setJoinStatus] = useState<JoinStatus>(
    projectData.participantStatus ? projectData.participantStatus : 'Not Joined'
  );
>>>>>>> 0ac01baa4c622dfc7d74ff1260d588d67ffd0325
  
  const { 
    opening, 
    records, 
    optionalDetails,
    media,
    links 
  } = projectData;
  
  if (!opening || !opening.creator) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Project not found</h2>
          <p className="text-muted-foreground">
            The project you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </div>
    );
  }
  
  const {
    title,
    short_description,
    category,
    long_description,
    eligibility,
    contact,
    creator
  } = opening;
  
  const eligibilityList = eligibility
    .split('\n')
    .filter(item => item.trim().length > 0);
<<<<<<< HEAD

  const renderJoinButton = () => {
    switch (joinStatus) {
      case 'Owner':
        return (
          <Button 
            variant="outline" 
            className="w-full py-6 text-base bg-gray-100 text-gray-500 hover:bg-gray-100 cursor-not-allowed"
            disabled
          >
            <CheckCircle2 className="h-5 w-5 mr-2" />
            Owner
          </Button>
        );
      case 'Already Joined':
        return (
          <Button 
            variant="outline" 
            className="w-full py-6 text-base bg-green-50 border-green-200 text-green-700 hover:bg-green-50 cursor-not-allowed"
            disabled
          >
            <CheckCircle2 className="h-5 w-5 mr-2" />
            Joined
          </Button>
        );
      case 'Active':
        return (
          <Button 
            onClick={onJoin}
            className="w-full py-6 text-base bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
          >
            Join Project
          </Button>
        );
      default:
        return null;
    }
=======
  
  const handleJoinProject = () => {
    // In a real app, this would call an API to join the project
    setJoinStatus('Pending');
    toast({
      title: "Join request submitted",
      description: "Your request to join this project has been submitted and is pending approval.",
    });
>>>>>>> 0ac01baa4c622dfc7d74ff1260d588d67ffd0325
  };
  
  const renderOptionalDetail = (detail: OpeningOptionalDetail) => {
    const contentItems = detail.content
      .split('\n')
      .filter(item => item.trim().length > 0);
    
    return (
      <div key={detail.heading} className="space-y-3 pb-5 border-b last:border-0 last:pb-0">
        <h3 className="text-lg font-semibold">{detail.heading}</h3>
        {detail.subheading && (
          <p className="text-sm text-muted-foreground">{detail.subheading}</p>
        )}
        
        <ul className="space-y-2">
          {contentItems.map((item, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>{item.replace(/^- /, '')}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  };
<<<<<<< HEAD

  return (
    <div className="container mx-auto max-w-6xl py-10 px-4 space-y-8 reveal-animation">
      {/* Go Back Button */}
      <div className="mb-6">
        <Button
          onClick={() => navigate(-1)}
          variant="ghost"
          className="group flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <span>Go Back</span>
        </Button>
      </div>

=======
  
  return (
    <div className="container mx-auto max-w-6xl py-10 px-4 space-y-8 reveal-animation">
>>>>>>> 0ac01baa4c622dfc7d74ff1260d588d67ffd0325
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Title and Category */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="secondary" className="px-3 py-1">
                {category}
              </Badge>
              {records?.max_people && (
                <Badge variant="outline" className="flex items-center gap-1.5">
                  <Users size={14} />
                  <span>Max {records.max_people} people</span>
                </Badge>
              )}
            </div>
            
            <h1 className="text-4xl font-bold tracking-tight">{title}</h1>
            
            <p className="text-lg text-muted-foreground text-balance">
              {short_description}
            </p>
          </div>
          
          {/* Creator Profile */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="p-5 pb-0">
              <h2 className="text-lg font-semibold">Project Creator</h2>
            </CardHeader>
            <CardContent className="p-5">
              <ProjectHeader creator={creator} />
            </CardContent>
          </Card>
          
          {/* Description */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">About This Project</h2>
            
            <div className="relative">
              <p className={`text-muted-foreground whitespace-pre-line ${
                !showFullDescription && long_description.length > 350 ? "line-clamp-5" : ""
              }`}>
                {long_description}
              </p>
<<<<<<< HEAD
            
=======
              
>>>>>>> 0ac01baa4c622dfc7d74ff1260d588d67ffd0325
              {long_description.length > 350 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2 flex items-center gap-1"
                  onClick={() => setShowFullDescription(!showFullDescription)}
                >
                  {showFullDescription ? (
                    <>
                      <ChevronUp size={16} />
                      <span>Read less</span>
                    </>
                  ) : (
                    <>
                      <ChevronDown size={16} />
                      <span>Read more</span>
                    </>
                  )}
                </Button>
              )}
            </div>
<<<<<<< HEAD
            
            {/* Media Gallery */}
            {media && media.length > 0 && (
              <div>
                <ProjectGallery media={media} />
              </div>
            )}
  
            {/* Eligibility */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">
                Eligibility & Requirements
              </h2>
              
              <div className="space-y-2">
                {eligibilityList.map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="mt-0.5 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                      <List size={14} />
                    </div>
                    <p className="text-muted-foreground">{item.replace(/^- /, '')}</p>
                  </div>
                ))}
              </div>
            </div>
  
            {/* Optional Details */}
            {optionalDetails && optionalDetails.length > 0 && (
              <div className="space-y-5">
                <h2 className="text-xl font-semibold">Additional Information</h2>
                <div className="space-y-6 divide-y">
                  {optionalDetails.map(renderOptionalDetail)}
                </div>
              </div>
            )}
  
            {/* Contact Info */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Contact Information</h2>
              <p className="text-muted-foreground whitespace-pre-line">{contact}</p>
            </div>
          </div>
        </div>
  
        {/* Sidebar */}
=======
          </div>
          
          {/* Media Gallery */}
          {media && media.length > 0 && (
            <div>
              <ProjectGallery media={media} />
            </div>
          )}
          
          {/* Eligibility */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">
              Eligibility & Requirements
            </h2>
            
            <div className="space-y-2">
              {eligibilityList.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="mt-0.5 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                    <List size={14} />
                  </div>
                  <p className="text-muted-foreground">{item.replace(/^- /, '')}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Optional Details */}
          {optionalDetails && optionalDetails.length > 0 && (
            <div className="space-y-5">
              <h2 className="text-xl font-semibold">Additional Information</h2>
              <div className="space-y-6 divide-y">
                {optionalDetails.map(renderOptionalDetail)}
              </div>
            </div>
          )}
          
          {/* Contact Info */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Contact Information</h2>
            <p className="text-muted-foreground whitespace-pre-line">{contact}</p>
          </div>
        </div>
        
>>>>>>> 0ac01baa4c622dfc7d74ff1260d588d67ffd0325
        <div className="space-y-6">
          {/* Join Button */}
          <div className="glass-panel p-5 text-center space-y-4 sticky top-6">
            <h3 className="text-lg font-semibold">Interested in this project?</h3>
            
<<<<<<< HEAD
            {renderJoinButton()}
=======
            {joinStatus === 'Not Joined' ? (
              <Button
                className="w-full py-6 text-base font-medium"
                disabled={true} // For development, we're keeping this inactive
                onClick={handleJoinProject}
              >
                Join Project
              </Button>
            ) : joinStatus === 'Pending' ? (
              <Button variant="outline" className="w-full py-6 text-base" disabled>
                Request Pending
              </Button>
            ) : (
              <Button variant="outline" className="w-full py-6 text-base bg-green-50 border-green-200 text-green-700" disabled>
                Accepted ✓
              </Button>
            )}
>>>>>>> 0ac01baa4c622dfc7d74ff1260d588d67ffd0325
            
            <p className="text-xs text-muted-foreground">
              By joining, you agree to the project's terms and conditions
            </p>
          </div>
          
          {/* Timeline */}
          <ProjectTimeline records={records} />
          
          {/* Links */}
          <ProjectLinks links={links} />
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;