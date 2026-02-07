import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import NotFound from "./pages/NotFound";
import Homepage from "./pages/Homepage";
import Profile from "./pages/Profile";
import PublicProfilePage from "./pages/PublicProfilePage";
import PeoplePage from "./pages/PeoplePage";
import EventDetailsPage from "./pages/EventDetailsPage";
import ClubCreate from "./pages/ClubCreate";
import ClubLogin from "./pages/ClubLogin";
import ClubDashboardPage from "./pages/ClubDashboardPage";
import CreateEventPage from "@/pages/CreateEventPage";
import EventPreviewPage from "@/pages/EventPreviewPage";
import EventsPage from './pages/EventsPage';
import ProjectsPage from './pages/ProjectsPage';
import ResourcesPage from './pages/ResourcesPage';
import CreateTemporaryOpening from './pages/CreateTemporaryOpening';
import EventAttendees from "./pages/EventAttendees";
import VerifyAttendeesPage from "./pages/verify-attendees/VerifyAttendeesPage";
import LostAndFound from "./pages/LostAndFound";
import { HomepageProvider } from '@/contexts/HomepageContext';
import { AuthProvider, useAuthContext } from '@/contexts/AuthContext';
import RecentOpeningsPage from "./pages/RecentOpeningsPage";
import Project from "./pages/Project";
import { useConnectionListener } from './hooks/useConnectionListeners';
import { useEventRegistrationListener } from './hooks/useEventRegistrationListener';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    },
  },
});

const ProtectedClubRoute = ({ children }: { children: React.ReactNode }) => {
  const clubLoggedIn = sessionStorage.getItem('club_logged_in') === 'true';
  return clubLoggedIn ? <>{children}</> : <Navigate to="/club/login" />;
};

const ProtectedAdminRoute = ({ children }: { children: React.ReactNode }) => {
  const adminLogin = sessionStorage.getItem('admin_logged_in') === 'true';
  return adminLogin ? <>{children}</> : <Navigate to="/signin" />;
};

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { hasSession, loading } = useAuthContext();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-xl text-primary">Loading...</div>
      </div>
    );
  }

  if (!hasSession()) {
    return <Navigate to="/signin" replace />;
  }

  return <>{children}</>;
};

const AuthenticatedRoute = ({ children }: { children: React.ReactNode }) => {
  const { hasSession, loading } = useAuthContext();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-xl text-primary">Loading...</div>
      </div>
    );
  }

  return hasSession() ? <Navigate to="/homepage" replace /> : <>{children}</>;
};

function App() {
  useConnectionListener();
  useEventRegistrationListener();
  return (
    <AuthProvider>
    <HomepageProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <TooltipProvider>
            <Routes>
              <Route
                path="/"
                element={
                  <AuthenticatedRoute>
                    <Index />
                  </AuthenticatedRoute>
                }
              />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/homepage" element={
                <ProtectedRoute>
                  <Homepage />
                </ProtectedRoute>} />
              <Route path="/event/:eventId" element={<EventDetailsPage />} />
              <Route path="/profile/:username" element={
                <ProtectedRoute>
                  <PublicProfilePage />
                </ProtectedRoute>
              } />
              <Route
                path="/people"
                element={
                  <ProtectedRoute>
                    <PeoplePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/lost-and-found"
                element={
                  <ProtectedRoute>
                    <LostAndFound />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/club/create"
                element={
                  <ProtectedRoute>
                    <ClubCreate />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/club/login"
                element={
                  <ProtectedRoute>
                    <ClubLogin />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/club/dashboard"
                element={
                  <ProtectedClubRoute>
                    <ClubDashboardPage />
                  </ProtectedClubRoute>
                }
              />
              <Route
                path="/club/create-event"
                element={
                  <ProtectedClubRoute>
                    <CreateEventPage />
                  </ProtectedClubRoute>
                }
              />
              <Route
                path="/club/event/:eventId/preview"
                element={
                  <ProtectedClubRoute>
                    <EventPreviewPage />
                  </ProtectedClubRoute>
                }
              />
              <Route path="/events-registered" element={
                <ProtectedRoute>
                  <EventsPage />
                </ProtectedRoute>
              } />
              <Route path="/collaborations" element={
                <ProtectedRoute>
                  <ProjectsPage />
                </ProtectedRoute>
              } />
              <Route path="/resources" element={
                <ProtectedRoute>
                  <ResourcesPage />
                </ProtectedRoute>
              } />
              <Route path="/create-temporary-opening" element={
                <ProtectedRoute>
                  <CreateTemporaryOpening />
                </ProtectedRoute>
              } />
              <Route path="/club/event-attendees/:event_id" element={
                <ProtectedClubRoute>
                  <EventAttendees />
                </ProtectedClubRoute>
              } />
              <Route path="/openings" element={
                <ProtectedRoute>
                  <RecentOpeningsPage />
                </ProtectedRoute>
                } />
                <Route path="/project/:opening_id" element={
                  <ProtectedRoute>
                    <Project />
                  </ProtectedRoute>} />
              <Route
                path="/verify-attendees"
                element={
                  <ProtectedClubRoute>
                    <VerifyAttendeesPage />
                  </ProtectedClubRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
          <Toaster />
          <Sonner />
        </BrowserRouter>
      </QueryClientProvider>
    </HomepageProvider>
    </AuthProvider>
  );
}

export default App;
