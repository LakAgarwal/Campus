// Update the handleExploreSection function in RightSidebar.tsx to navigate to the people page
<<<<<<< HEAD
import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Star, Users, BookOpen, FileText, Compass, Bookmark, ChevronRight, Sparkles } from "lucide-react";
=======
import React from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Star, Users, BookOpen, FileText, Compass, Bookmark, ChevronRight } from "lucide-react";
>>>>>>> 0ac01baa4c622dfc7d74ff1260d588d67ffd0325
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
<<<<<<< HEAD
import { api } from "@/api/client";
import { useAuth } from "@/hooks/use-auth";
import { handleAIAlert } from "@/lib/ai-alerts";

interface Alert {
  id: number;
  heading: string;
  content: string;
  time: string;
  created_at: string;
=======

interface Alert {
  id: number;
  title: string;
  message: string;
  type: string;
  countdown: string;
>>>>>>> 0ac01baa4c622dfc7d74ff1260d588d67ffd0325
}

interface RightSidebarProps {
  isRightSidebarVisible: boolean;
  setIsRightSidebarVisible: (value: boolean) => void;
  isMobileView: boolean;
  isTabletView: boolean;
<<<<<<< HEAD
  handleNavigateToBookmarks: () => void;
  handleExploreSection: (section: string) => void;
=======
  alerts: Alert[];
  handleNavigateToBookmarks: () => void;
>>>>>>> 0ac01baa4c622dfc7d74ff1260d588d67ffd0325
}

const RightSidebar: React.FC<RightSidebarProps> = ({
  isRightSidebarVisible,
  setIsRightSidebarVisible,
  isMobileView,
  isTabletView,
<<<<<<< HEAD
  handleNavigateToBookmarks,
  handleExploreSection,
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const alertsContainerRef = useRef<HTMLDivElement>(null);
  const scrollIntervalRef = useRef<NodeJS.Timeout>();
=======
  alerts,
  handleNavigateToBookmarks,
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
>>>>>>> 0ac01baa4c622dfc7d74ff1260d588d67ffd0325
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
      },
    },
  };

<<<<<<< HEAD
  const fetchAlerts = async () => {
    if (!user) return;
    try {
      const data = await api.get<Alert[]>(`/alerts?userId=${user.id}`).catch(() => []);
      setAlerts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching alerts:', error);
      toast({
        title: "Error",
        description: "Failed to fetch alerts",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, [user, toast]);

  const handleAIClick = async () => {
    if (!user) return;
    setIsGenerating(true);
    try {
      await api.delete(`/alerts?userId=${user.id}`).catch(() => null);
      await handleAIAlert(user.id, new Date());
      await new Promise(resolve => setTimeout(resolve, 500));
      await fetchAlerts();
      toast({
        title: "Success",
        description: "AI alerts generated successfully",
      });
    } catch (error) {
      console.error('Error processing AI alerts:', error);
      toast({
        title: "Error",
        description: "Failed to process AI alerts",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (!alertsContainerRef.current || alerts.length <= 1 || isHovered) return;

    const container = alertsContainerRef.current;
    const scrollHeight = container.scrollHeight;
    const clientHeight = container.clientHeight;

    if (scrollHeight <= clientHeight) return;

    let currentScroll = 0;
    const scrollStep = 1; // Adjust this value to control scroll speed

    const scroll = () => {
      if (isHovered) return;

      currentScroll += scrollStep;
      if (currentScroll >= scrollHeight - clientHeight) {
        currentScroll = 0;
      }
      container.scrollTop = currentScroll;
    };

    scrollIntervalRef.current = setInterval(scroll, 50); // Adjust interval for smooth scrolling

    return () => {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
      }
    };
  }, [alerts, isHovered]);

  

=======
  const handleExploreSection = (section: string) => {
    if (section === "Like-Minded People") {
      navigate('/people'); // Enables navigation to the people page
    } else if (section === "Recent Openings") {
      navigate('/openings');}
      else {
      toast({
        title: "Coming Soon",
        description: `${section} will be available soon`,
      });
    }
  };
  
  
>>>>>>> 0ac01baa4c622dfc7d74ff1260d588d67ffd0325
  return (
    <motion.aside
      className={`
        fixed right-0 top-16 z-20 bg-white shadow-lg md:shadow-sm rounded-l-lg md:rounded-lg
        transition-transform duration-300 ease-in-out h-[calc(100vh-4rem)]
        w-72
        ${
          !isRightSidebarVisible && (isMobileView || isTabletView)
            ? "translate-x-full"
            : "translate-x-0"
        }
      `}
    >
      <button
        onClick={() => setIsRightSidebarVisible(!isRightSidebarVisible)}
        className={`
          absolute -left-3 top-4 bg-white rounded-full p-1.5 shadow-md
          hover:bg-gray-50 transition-colors duration-200
          ${isMobileView || isTabletView ? "block" : "hidden"}
        `}
      >
        <ChevronRight
          className={`h-4 w-4 text-gray-600 transition-transform duration-300 ${
            isRightSidebarVisible ? "rotate-180" : ""
          }`}
        />
      </button>
      <div className="h-full flex flex-col p-4 overflow-hidden">
        <motion.div
          className="flex-shrink-0"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.h3
            variants={itemVariants}
            className="font-medium text-lg mb-3 flex items-center gap-2"
          >
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            Important Alerts
          </motion.h3>

<<<<<<< HEAD
          <motion.div variants={itemVariants} className="mb-4">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start hover:bg-primary/10 transition-colors group bg-gradient-to-r from-purple-50 to-blue-50 hover:from-purple-100 hover:to-blue-100"
              onClick={handleAIClick}
              disabled={isGenerating}
            >
              <Sparkles className={`h-4 w-4 mr-2 text-purple-500 group-hover:text-purple-600 transition-colors ${isGenerating ? 'animate-pulse' : ''}`} />
              <span className="group-hover:text-primary transition-colors font-medium">
                {isGenerating ? 'Generating Alerts...' : 'AI Alerts'}
              </span>
            </Button>
          </motion.div>

          <motion.div
            ref={alertsContainerRef}
            variants={containerVariants}
            className="space-y-3 h-48 overflow-y-auto pr-1 custom-scrollbar"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {isLoading || isGenerating ? (
              <div className="text-sm text-gray-500 flex items-center justify-center h-full">
                {isGenerating ? 'Generating new alerts...' : 'Loading alerts...'}
              </div>
            ) : alerts.length === 0 ? (
              <div className="text-sm text-gray-500 flex flex-col items-center justify-center h-full gap-2">
                <p>No alerts to display</p>
                <p className="text-xs text-gray-400">Click the AI Alerts button above to generate alerts</p>
              </div>
            ) : (
              alerts.map((alert) => (
                <motion.div
                  key={alert.id}
                  variants={itemVariants}
                  className="p-3 rounded-md bg-amber-50 border border-amber-100 hover:bg-amber-100 transition-colors duration-200"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                      <h4 className="font-medium text-sm">{alert.heading}</h4>
                    </div>
                    <Badge
                      variant="outline"
                      className="whitespace-nowrap px-2 py-0.5 text-xs border-amber-200 text-amber-700"
                    >
                      {alert.time}
                    </Badge>
                  </div>
                  <p className="text-sm mt-1">{alert.content}</p>
                </motion.div>
              ))
            )}
=======
          <motion.div
            variants={containerVariants}
            className="space-y-3 h-48 overflow-y-auto pr-1 custom-scrollbar"
          >
            {alerts
              .sort((a, b) => {
                if (a.type === "emergency" && b.type !== "emergency")
                  return -1;
                if (b.type === "emergency" && a.type !== "emergency")
                  return 1;
                const aTime = parseInt(a.countdown.split(" ")[0]);
                const bTime = parseInt(b.countdown.split(" ")[0]);
                const aIsHours = a.countdown.includes("hours");
                const bIsHours = b.countdown.includes("hours");
                const aHours = aIsHours ? aTime : aTime * 24;
                const bHours = bIsHours ? bTime : bTime * 24;
                return aHours - bHours;
              })
              .map((alert) => (
                <motion.div
                  key={alert.id}
                  variants={itemVariants}
                  className={`
                    p-3 rounded-md transition-colors duration-200
                    hover:bg-red-100 hover:border-red-200
                    ${
                      alert.type === "emergency"
                        ? "bg-red-50 border border-red-100"
                        : alert.countdown.includes("hours")
                        ? "bg-red-50 border border-red-200"
                        : "bg-amber-50 border border-amber-100"
                    }
                  `}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <AlertTriangle
                          className={`h-4 w-4 ${
                            alert.countdown.includes("hours")
                              ? "text-red-500"
                              : "text-amber-500"
                          }`}
                        />
                        {alert.countdown.includes("hours") && (
                          <div className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full animate-blink" />
                        )}
                      </div>
                      <h4 className="font-medium text-sm">{alert.title}</h4>
                    </div>
                    <Badge
                      variant="outline"
                      className={`
                        whitespace-nowrap px-2 py-0.5 text-xs
                        ${
                          alert.countdown.includes("hours")
                            ? "border-red-200 text-red-700"
                            : "border-amber-200 text-amber-700"
                        }
                      `}
                    >
                      {alert.countdown}
                    </Badge>
                  </div>
                  <p className="text-sm mt-1">{alert.message}</p>
                </motion.div>
              ))}
>>>>>>> 0ac01baa4c622dfc7d74ff1260d588d67ffd0325
          </motion.div>
        </motion.div>

        <div className="w-full h-px bg-gray-200 my-4" />

        <motion.div variants={itemVariants} className="flex-shrink-0">
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start hover:bg-primary/10 transition-colors group"
            onClick={handleNavigateToBookmarks}
          >
            <Bookmark className="h-4 w-4 mr-2 group-hover:text-primary transition-colors" />
            <span className="group-hover:text-primary transition-colors">
              View All Bookmarks
            </span>
          </Button>
        </motion.div>

        <div className="w-full h-px bg-gray-200 my-4" />

        <motion.div
          className="flex-1"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.h3
            variants={itemVariants}
            className="font-medium text-lg mb-3 flex items-center gap-2"
          >
            <Star className="h-4 w-4 text-primary" />
            Top Resources
          </motion.h3>

          <motion.div variants={containerVariants} className="space-y-3">
            <motion.div variants={itemVariants}>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start mb-2 hover:bg-primary/10 transition-colors group"
                onClick={() => handleExploreSection("Like-Minded People")}
              >
                <Users className="h-4 w-4 mr-2 group-hover:text-primary transition-colors" />
                <span className="group-hover:text-primary transition-colors">
                  Explore Like-Minded People
                </span>
              </Button>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start mb-2 hover:bg-primary/10 transition-colors group"
                onClick={() => handleExploreSection("Resources")}
              >
                <BookOpen className="h-4 w-4 mr-2 group-hover:text-primary transition-colors" />
                <span className="group-hover:text-primary transition-colors">
                  Explore Resources
                </span>
              </Button>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start mb-2 hover:bg-primary/10 transition-colors group"
                onClick={() => handleExploreSection("Recent Openings")}
              >
                <FileText className="h-4 w-4 mr-2 group-hover:text-primary transition-colors" />
                <span className="group-hover:text-primary transition-colors">
                  Explore Recent Openings
                </span>
              </Button>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start hover:bg-primary/10 transition-colors group"
                onClick={() => handleExploreSection("Articles")}
              >
                <Compass className="h-4 w-4 mr-2 group-hover:text-primary transition-colors" />
                <span className="group-hover:text-primary transition-colors">
                  Explore Articles
                </span>
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </motion.aside>
  );
};

export default RightSidebar;