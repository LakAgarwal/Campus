import { Outlet, useLocation } from "react-router-dom";
import DashboardSidebar from "./DashboardSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navbar from "./Navbar";
import { useState, useEffect } from "react";
import { MoonIcon, SunIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    setIsMounted(true);
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem("admin-theme-mode");
    if (savedTheme === "light") {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
    } else {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    }
    
  }, []);

  const toggleTheme = () => {
    const newThemeValue = !isDarkMode;
    setIsDarkMode(newThemeValue);
    
    // Save theme preference
    localStorage.setItem("admin-theme-mode", newThemeValue ? "dark" : "light");
    
    // Apply theme class to document
    if (newThemeValue) {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    }
    
    // Show toast notification
    toast({
      title: `${newThemeValue ? "Dark" : "Light"} mode activated`,
      description: `Dashboard theme has been switched to ${newThemeValue ? "dark" : "light"} mode`,
    });
    
  };

  if (!isMounted) {
    return null;
  }

  return (
    <SidebarProvider>
      <TooltipProvider>
        <div className={`flex min-h-screen w-full bg-admin-background ${isDarkMode ? 'dark' : 'light'}`}>
          <DashboardSidebar />
          <div className="flex flex-col flex-1 overflow-hidden">
            <Navbar>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="ml-auto glass-button"
                aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                {isDarkMode ? (
                  <SunIcon className="h-5 w-5 text-yellow-400" />
                ) : (
                  <MoonIcon className="h-5 w-5 text-slate-700" />
                )}
              </Button>
            </Navbar>
            <main className="flex-1 overflow-auto p-6">
              <div className="mx-auto max-w-7xl">
                {children || <Outlet />}
              </div>
            </main>
            <footer className="glass-footer border-t border-admin-border p-4 text-center text-sm text-admin-muted-foreground">
              <p>© {new Date().getFullYear()} Admin Dashboard • All rights reserved</p>
            </footer>
          </div>
        </div>
      </TooltipProvider>
    </SidebarProvider>
  );
};

export default DashboardLayout;