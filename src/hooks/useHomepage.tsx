import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { apiFetch } from "@/lib/api";
import { useAuthContext } from "@/contexts/AuthContext";

type EventStatus = "Open" | "Closing Soon" | "Waitlist" | "Closed";

interface DatabaseEvent {
  event_id: number;
  club_id: number;
  name: string;
  datetime: string;
  location: string;
  short_description: string;
  eligibility: string;
  registration_deadline: string;
  status: EventStatus;
  max_attendees: number | null;
  current_attendees: number;
  is_deleted: boolean;
  created_at: string;
  event_thumbnail: string;
  clubs: { name: string } | null;
  event_tags: { tag: string }[];
}

interface Event {
  event_id: number;
  club_id: number;
  name: string;
  datetime: string;
  location: string;
  short_description: string;
  eligibility: string;
  registration_deadline: string;
  status: EventStatus;
  max_attendees: number | null;
  current_attendees: number;
  event_thumbnail: string;
  club_name: string;
  tags: string[];
}

interface UserPreferences {
  categories: string[];
  lastUpdated: string;
}

interface Alert {
  id: number;
  title: string;
  message: string;
  type: string;
  countdown: string;
}

export function useHomepage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isRightSidebarVisible, setIsRightSidebarVisible] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null);
  const [isMobileView, setIsMobileView] = useState(false);
  const [isTabletView, setIsTabletView] = useState(false);

  const alerts: Alert[] = [
    {
      id: 1,
      title: "Registration Deadline",
      message: "AI Workshop registration closes in 2 days",
      type: "deadline",
      countdown: "2 days",
    },
    {
      id: 2,
      title: "Campus Alert",
      message: "Library will be closed this weekend for maintenance",
      type: "emergency",
      countdown: "3 days",
    },
    {
      id: 3,
      title: "Urgent Registration",
      message: "Tech conference registration closing soon!",
      type: "deadline",
      countdown: "12 hours",
    },
  ];

  const categories = [
    { id: "technical", label: "Technical", isPreference: true },
    { id: "workshop", label: "Workshop", isPreference: true },
    { id: "cultural", label: "Cultural" },
    { id: "networking", label: "Networking" },
    { id: "sports", label: "Sports" },
    { id: "academic", label: "Academic" },
    { id: "music", label: "Music" },
    { id: "dance", label: "Dance" },
    { id: "arts", label: "Arts" },
    { id: "finance", label: "Finance" },
    { id: "coding", label: "Coding", isPreference: true },
    { id: "entrepreneurship", label: "Entrepreneurship" },
    { id: "environment", label: "Environment" },
    { id: "gaming", label: "Gaming" },
    { id: "literature", label: "Literature" },
    { id: "health", label: "Health & Wellness" },
  ].map((cat) => ({
    ...cat,
    isPreference: userPreferences?.categories.includes(cat.id) || false,
  }));

  const isMobile = () => window.innerWidth < 768;
  const isTablet = () => window.innerWidth >= 768 && window.innerWidth < 1024;

  useEffect(() => {
    const handleResize = () => {
      const mobile = isMobile();
      const tablet = isTablet();
      setIsMobileView(mobile);
      setIsTabletView(tablet);

      if (mobile) {
        setViewMode("list");
        setIsSidebarExpanded(false);
      } else if (tablet) {
        setIsSidebarExpanded(false);
      } else {
        setIsSidebarExpanded(true);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!isMobileView) {
        const sidebarWidth = isSidebarExpanded ? 272 : 64;
        const isOverSidebar = event.clientX <= sidebarWidth;

        if (isOverSidebar && !isSidebarExpanded) {
          setIsSidebarExpanded(true);
        } else if (!isOverSidebar && isSidebarExpanded) {
          setIsSidebarExpanded(false);
        }
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, [isMobileView, isSidebarExpanded]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        document.getElementById('search-container') &&
        !document.getElementById('search-container')?.contains(event.target as Node)
      ) {
        setIsSearchExpanded(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const res = await apiFetch<Array<Record<string, unknown>>>("/events");
      if (res.error || !res.data) {
        throw new Error(res.error || "Failed to fetch");
      }
      const formattedEvents: Event[] = (res.data as Array<Record<string, unknown>>).map(
        (e: Record<string, unknown>) => ({
          event_id: (e.event_id ?? e.eventId) as number,
          club_id: (e.club_id ?? e.clubId) as number,
          name: (e.name ?? "") as string,
          datetime: (e.datetime ?? "") as string,
          location: (e.location ?? "") as string,
          short_description: (e.short_description ?? e.shortDescription ?? "") as string,
          eligibility: (e.eligibility ?? "") as string,
          registration_deadline: (e.registration_deadline ?? e.registrationDeadline ?? "") as string,
          status: (e.status ?? "Open") as Event["status"],
          max_attendees: (e.max_attendees ?? e.maxAttendees ?? null) as number | null,
          current_attendees: (e.current_attendees ?? e.currentAttendees ?? 0) as number,
          event_thumbnail: (e.event_thumbnail ?? e.eventThumbnail ?? "") as string,
          club_name: (e.club_name ?? e.clubName ?? "Unknown Club") as string,
          tags: Array.isArray(e.tags) ? (e.tags as string[]) : [],
        })
      );
      setEvents(formattedEvents);
    } catch {
      toast({
        title: "Error",
        description: "Failed to load events. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const { signOut } = useAuthContext();
  const handleLogout = () => {
    signOut();
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account",
    });
    navigate("/signin");
  };

  const handleRegisterEvent = (eventId: number) => {
    toast({
      title: "Registration Successful",
      description: "You have registered for the event",
    });
  };

  const handleSaveEvent = (eventId: number) => {
    toast({
      title: "Event Saved",
      description: "Event has been added to your bookmarks",
    });
  };

  const handleShareEvent = (eventId: number) => {
    toast({
      title: "Share Link Generated",
      description: "Event link has been copied to clipboard",
    });
  };

  const handleNavigateToBookmarks = () => {
    toast({
      title: "Coming Soon",
      description: "Bookmarks page will be available soon",
    });
  };

  const handleExploreSection = (section: string) => {
    toast({
      title: "Coming Soon",
      description: `${section} will be available soon`,
    });
  };

  const handleNavigateToProfile = () => {
    navigate("/profile");
  };

  const handleNavigateToClubCreate = () => {
    navigate("/club/create");
  };

  const fetchUserPreferences = async () => {
    try {
      // Backend does not have user_preferences yet; leave preferences empty
      setUserPreferences(null);
    } catch (error) {
      console.error("Error fetching user preferences:", error);
    }
  };

  const handleFilterChange = ({
    categories,
    timeRange,
    showPreferencesFirst,
  }: {
    categories: string[];
    timeRange: number | null;
    showPreferencesFirst: boolean;
  }) => {
    let filtered = [...events];

    // Filter by categories
    if (categories.length > 0) {
      filtered = filtered.filter((event) =>
        event.tags.some((tag) => {
          // Normalize both the event tag and category for comparison
          const normalizedTag = tag.toLowerCase().trim();
          const normalizedCategory = categories.find(cat => 
            cat.toLowerCase().trim() === normalizedTag
          );
          return normalizedCategory !== undefined;
        })
      );
    }

    // Filter by time range
    if (timeRange) {
      const now = new Date();
      const rangeEnd = new Date(now.getTime() + timeRange * 60 * 60 * 1000);
      filtered = filtered.filter(
        (event) =>
          new Date(event.datetime) >= now &&
          new Date(event.datetime) <= rangeEnd
      );
    }

    // Sort events based on user preferences
    if (userPreferences?.categories.length) {
      filtered.sort((a, b) => {
        // Count matching preferences for each event
        const aMatches = a.tags.filter((tag) =>
          userPreferences.categories.includes(tag.toLowerCase().trim())
        ).length;
        const bMatches = b.tags.filter((tag) =>
          userPreferences.categories.includes(tag.toLowerCase().trim())
        ).length;

        // If one has more matches than the other, sort by that
        if (aMatches !== bMatches) {
          return bMatches - aMatches;
        }

        // If matches are equal, sort by deadline
        const aDeadline = new Date(a.registration_deadline).getTime();
        const bDeadline = new Date(b.registration_deadline).getTime();
        return aDeadline - bDeadline;
      });
    } else {
      // If no preferences, just sort by deadline
      filtered.sort((a, b) => {
        const aDeadline = new Date(a.registration_deadline).getTime();
        const bDeadline = new Date(b.registration_deadline).getTime();
        return aDeadline - bDeadline;
      });
    }

    setFilteredEvents(filtered);
  };

  useEffect(() => {
    if (events.length > 0) {
      handleFilterChange({
        categories: categories.map((c) => c.id),
        timeRange: null,
        showPreferencesFirst: true,
      });
    }
  }, [events, userPreferences]);

  useEffect(() => {
    fetchUserPreferences();
  }, []);

  return {
    viewMode,
    setViewMode,
    isSearchExpanded,
    setIsSearchExpanded,
    isSidebarExpanded,
    setIsSidebarExpanded,
    isRightSidebarVisible,
    setIsRightSidebarVisible,
    isMobileView,
    isTabletView,
    events,
    isLoading,
    filteredEvents,
    alerts,
    categories,
    userPreferences,
    handleLogout,
    handleRegisterEvent,
    handleSaveEvent,
    handleShareEvent,
    handleNavigateToBookmarks,
    handleExploreSection,
    handleNavigateToProfile,
    handleNavigateToClubCreate,
    handleFilterChange,
  };
}
