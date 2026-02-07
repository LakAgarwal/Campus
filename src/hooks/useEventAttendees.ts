import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from "@/api/client";
import { useToast } from '@/hooks/use-toast';

interface Profile {
  id: string;
  full_name: string;
  roll_number: string;
  year_of_study: number;
  branch: string;
  username: string;
}

interface EventQuestion {
  question_id: number;
  question: string;
  event_id: number;
}

interface StudentResponse {
  user_id: string;
  question_id: number;
  response: string;
}

interface EventRegistration {
  id: string;
  full_name: string;
  roll_no: string;
  year_of_study: number;
  branch: string;
  username: string;
  status: 'pending' | 'accepted' | 'rejected';
  submitted_at: string;
  payment_proof: string | null;
  responses: StudentResponse[];
}

interface EventAttendees {
  eventId: number;
  activeTab: 'approved' | 'pending';
  setActiveTab: (tab: 'approved' | 'pending') => void;
  registrations: EventRegistration[];
  filteredAttendees: EventRegistration[];
  eventQuestions: EventQuestion[];
  isLoading: boolean;
  error: Error | null;
  expandedResponses: Record<string, boolean>;
  toggleResponseVisibility: (userId: string) => void;
  updateAttendeeStatus: (userId: string, status: 'accepted' | 'rejected' | 'pending') => Promise<void>;
  tableScrolled: boolean;
  handleTableScroll: (e: React.UIEvent<HTMLDivElement>) => void;
  refreshAttendees: () => Promise<void>;
}

export const useEventAttendees = (eventId: number): EventAttendees => {
  const { event_id } = useParams<{ event_id: string }>();
  const eventIdNumber = event_id ? parseInt(event_id, 10) : 0;
  const [activeTab, setActiveTab] = useState<'approved' | 'pending'>('approved');
  const [expandedResponses, setExpandedResponses] = useState<Record<string, boolean>>({});
  const [tableScrolled, setTableScrolled] = useState(false);
  const { toast } = useToast();
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [eventQuestions, setEventQuestions] = useState<EventQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchAttendees = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const registrationData = await api.get<{ user_id: string; status: string; submitted_at?: string; payment_proof?: string }[]>('/events/' + eventIdNumber + '/registrations') || [];
      const userIds = registrationData.map(reg => reg.user_id);
      const allProfiles = await api.get<{ id: string; full_name: string; roll_number: string; year_of_study: number; branch: string; username: string }[]>('/profiles').catch(() => []);
      const profiles = (Array.isArray(allProfiles) ? allProfiles : []).filter((p: { id: string }) => userIds.includes(p.id));
      const questions = await api.get<EventQuestion[]>('/events/' + eventIdNumber + '/questions').catch(() => []);
      setEventQuestions(Array.isArray(questions) ? questions : []);

      let responses: StudentResponse[] = [];
      const questionIds = (Array.isArray(questions) ? questions : []).map(q => q.question_id);
      if (questionIds.length > 0) {
        const responseData = await api.get<StudentResponse[]>('/events/' + eventIdNumber + '/responses').catch(() => []);
        responses = Array.isArray(responseData) ? responseData : [];
      }

      // 6. Map all data together
      const mappedRegistrations = registrationData.map(registration => {
        const profile = profiles.find(p => p.id === registration.user_id);
        const userResponses = responses
          .filter(r => r.user_id === registration.user_id)
          .map(r => ({
            user_id: r.user_id,
            question_id: r.question_id,
            response: r.response
          }));

        return {
          id: registration.user_id,
          full_name: profile?.full_name || 'Unknown',
          roll_no: profile?.roll_number || 'N/A',
          year_of_study: profile?.year_of_study || 0,
          branch: profile?.branch || 'N/A',
          username: profile?.username || 'anonymous',
          status: registration.status,
          submitted_at: registration.created_at,
          payment_proof: registration.payment_proof,
          responses: userResponses
        };
      });

      setRegistrations(mappedRegistrations);
    } catch (err) {
      console.error("Error fetching attendees:", err);
      setError(err instanceof Error ? err : new Error("Failed to fetch attendees"));
      toast({
        title: "Error",
        description: "Failed to fetch event attendees. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (eventIdNumber) {
      fetchAttendees();
    }
  }, [eventIdNumber]);

  // Filter attendees based on active tab
  const filteredAttendees = registrations?.filter(attendee => 
    activeTab === 'approved' 
      ? attendee.status === 'accepted'
      : attendee.status === 'pending'
  ) || [];

  const toggleResponseVisibility = (userId: string) => {
    setExpandedResponses(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  const updateAttendeeStatus = async (userId: string, newStatus: 'accepted' | 'rejected' | 'pending') => {
    try {
      await api.patch('/events/' + eventIdNumber + '/registrations/' + userId + '/status', { status: newStatus });

      // Refresh the attendees list
      await fetchAttendees();

      toast({
        title: "Success",
        description: `Registration ${newStatus} successfully.`,
      });
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Error",
        description: "Failed to update registration status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleTableScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    setTableScrolled(scrollTop > 0);
  };

  return {
    eventId: eventIdNumber,
    activeTab,
    setActiveTab,
    registrations,
    filteredAttendees,
    eventQuestions,
    isLoading,
    error,
    expandedResponses,
    toggleResponseVisibility,
    updateAttendeeStatus,
    tableScrolled,
    handleTableScroll,
    refreshAttendees: fetchAttendees
  };
};