import { apiFetch } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";

// Event status options
export const EVENT_STATUS = ["Open", "Closing Soon", "Waitlist", "Closed", "Cancelled"] as const;

// Event tags options
export const EVENT_TAGS = [
  "Technical",
  "Cultural",
  "Music",
  "Dance",
  "Arts",
  "Finance",
  "Coding",
  "Web Development",
  "Sports",
  "Entrepreneurship",
  "Environment",
  "Health & Wellness",
  "Gaming",
  "Literature",
] as const;

export interface EventFormValues {
  name: string;
  datetime: Date;
  location: string;
  short_description: string;
  eligibility: string;
  registration_deadline: Date;
  status: typeof EVENT_STATUS[number];
  max_attendees: number | null;
  event_thumbnail?: string;
  tag: typeof EVENT_TAGS[number];
}

export const createEvent = async (data: EventFormValues, clubId: number) => {
  const { toast } = useToast();
  try {
    const res = await apiFetch<Record<string, unknown>>("/events", {
      method: "POST",
      body: JSON.stringify({
        club_id: clubId,
        name: data.name,
        datetime: data.datetime.toISOString(),
        location: data.location,
        short_description: data.short_description,
        eligibility: data.eligibility,
        registration_deadline: data.registration_deadline.toISOString(),
        status: data.status,
        max_attendees: data.max_attendees,
        event_thumbnail: data.event_thumbnail,
        tag: data.tag,
        tags: [data.tag],
      }),
    });
    if (res.error || !res.data) {
      throw new Error(res.error || "Failed to create event");
    }
    toast({
      title: "Success",
      description: "Event created successfully!",
    });
    return { success: true, eventData: res.data };
  } catch (err) {
    toast({
      title: "Error",
      description: err instanceof Error ? err.message : "Failed to create event",
      variant: "destructive",
    });
    return { success: false, error: err };
  }
}; 
