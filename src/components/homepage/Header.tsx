import React, { useRef } from "react";
<<<<<<< HEAD
import { User, Search, Plus, QrCode, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";
import { getCurrentUserId } from "@/api/client";
=======
import { User, Bell, Search, Plus, Scroll, QrCode, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";
import { useAuthContext } from "@/contexts/AuthContext";
>>>>>>> 0ac01baa4c622dfc7d74ff1260d588d67ffd0325
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import IconButton from "@/components/ui/buttons/IconButton";
import TriggerButton from "@/components/ui/buttons/TriggerButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
<<<<<<< HEAD
import NewsletterAlertsPanel from "@/components/homepage/NewsletterAlertsPanel";
import NotificationPanel from "@/components/homepage/NotificationPanel";
=======
>>>>>>> 0ac01baa4c622dfc7d74ff1260d588d67ffd0325

interface HeaderProps {
  isSearchExpanded: boolean;
  setIsSearchExpanded: (value: boolean) => void;
  isMobileView: boolean;
  handleLogout: () => void;
  handleNavigateToProfile: () => void;
  handleNavigateToClubCreate: () => void;
}

const Header: React.FC<HeaderProps> = ({
  isSearchExpanded,
  setIsSearchExpanded,
  isMobileView,
  handleLogout,
  handleNavigateToProfile,
  handleNavigateToClubCreate,
}) => {
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

<<<<<<< HEAD
  const handleCreateOpening = async () => {
    const userId = getCurrentUserId();
    if (userId) {
=======
  const { hasSession } = useAuthContext();
  const handleCreateOpening = () => {
    if (hasSession()) {
>>>>>>> 0ac01baa4c622dfc7d74ff1260d588d67ffd0325
      navigate("/create-temporary-opening");
    } else {
      toast({
        title: "Authentication Required",
        description: "Please sign in to create an opening",
        variant: "destructive",
      });
      navigate("/signin");
    }
  };

  return (
    <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4 flex justify-between items-center h-16">
        <div className="flex items-center space-x-4">
<<<<<<< HEAD
          <h1 className="text-xl font-bold text-primary">Campus SETU</h1>
          <NewsletterAlertsPanel />
=======
          <h1 className="text-xl font-bold text-primary">Club Scheduler</h1>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <IconButton icon={Scroll} badge={3} />
              </TooltipTrigger>
              <TooltipContent>
                <p>Newsletters</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
>>>>>>> 0ac01baa4c622dfc7d74ff1260d588d67ffd0325
        </div>

        <div
          ref={searchRef}
          className="relative flex items-center max-w-xl transition-all duration-300 ease-in-out"
          style={{ width: isSearchExpanded ? "100%" : "220px" }}
        >
          <div className="w-full relative">
            <Input
              type="text"
              placeholder="Search events, clubs, people..."
              className="w-full pl-10 pr-10 transition-all duration-300 focus:ring-2 focus:ring-primary/50"
              onFocus={() => setIsSearchExpanded(true)}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 p-1"
            >
              <QrCode className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <TriggerButton
                      icon={Plus}
                      label={!isMobileView ? "Create" : undefined}
                      className="flex items-center gap-1 hover:bg-primary/10 transition-colors duration-300"
                    />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="animate-fadeIn">
                    <DropdownMenuItem 
                      className="hover:bg-primary/10 cursor-pointer transition-colors"
                      onClick={handleCreateOpening}
                    >
                      Create Temporary Opening
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                    className="hover:bg-primary/10 cursor-pointer transition-colors">
                      Create Article
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="hover:bg-primary/10 cursor-pointer transition-colors"
                      onClick={handleNavigateToClubCreate}
                    >
                      Create Club/Organization
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TooltipTrigger>
              <TooltipContent>
                <p>Create New</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

<<<<<<< HEAD
          <NotificationPanel />
=======
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <IconButton icon={Bell} badge={5} />
              </TooltipTrigger>
              <TooltipContent>
                <p>Notifications</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
>>>>>>> 0ac01baa4c622dfc7d74ff1260d588d67ffd0325

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <IconButton icon={User} onClick={handleNavigateToProfile} />
              </TooltipTrigger>
              <TooltipContent>
                <p>Profile</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <IconButton icon={LogOut} onClick={handleLogout} />
              </TooltipTrigger>
              <TooltipContent>
                <p>Logout</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </header>
  );
};

export default Header;
