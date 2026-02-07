import { api } from "@/api/client";
import { VolunteerEvent } from "@/types/event";
import { toast } from "@/hooks/use-toast";

export const fetchEvents = async (): Promise<VolunteerEvent[]> => {
  try {
    const data = await api.get<VolunteerEvent[]>(`/volunteering-events`);
    return (data || []).map((event: VolunteerEvent) => ({
      ...event,
      organizer_name: event.organizer_name ?? null
    }));
  } catch (error) {
    console.error("Error fetching events:", error);
    toast({
      title: "Error",
      description: "Could not load volunteering events",
      variant: "destructive"
    });
    return [];
  }
};

export const createEvent = async (event: Omit<VolunteerEvent, 'id' | 'created_at' | 'organizer_name'>): Promise<VolunteerEvent | null> => {
  try {
    const data = await api.post<VolunteerEvent>(`/volunteering-events`, event);
    toast({
      title: "Success!",
      description: "Volunteering event has been created",
      variant: "default"
    });
    return { ...data, organizer_name: data.organizer_name ?? null };
  } catch (error) {
    console.error("Error creating event:", error);
    toast({
      title: "Error",
      description: "Could not create volunteering event",
      variant: "destructive"
    });
    return null;
  }
};
