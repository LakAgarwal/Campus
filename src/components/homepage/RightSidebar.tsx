// Update the handleExploreSection function in RightSidebar.tsx to navigate to the people page
import React from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Star, Users, BookOpen, FileText, Compass, Bookmark, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

interface Alert {
  id: number;
  title: string;
  message: string;
  type: string;
  countdown: string;
}

interface RightSidebarProps {
  isRightSidebarVisible: boolean;
  setIsRightSidebarVisible: (value: boolean) => void;
  isMobileView: boolean;
  isTabletView: boolean;
  alerts: Alert[];
  handleNavigateToBookmarks: () => void;
}

const RightSidebar: React.FC<RightSidebarProps> = ({
  isRightSidebarVisible,
  setIsRightSidebarVisible,
  isMobileView,
  isTabletView,
  alerts,
  handleNavigateToBookmarks,
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
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