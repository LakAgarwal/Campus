import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiFetch } from "@/lib/api";
import { EventDetails } from "@/types/event";
import { useToast } from "@/components/ui/use-toast";

const EventDetailsPage = () => {
  const { eventId } = useParams();
  const { toast } = useToast();
  const [event, setEvent] = useState<EventDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEventDetails = async () => {
      // 1. Validate ID
      const eventIdNumber = eventId ? parseInt(eventId, 10) : 0;
      
      if (isNaN(eventIdNumber) || eventIdNumber === 0) {
        toast({ title: "Invalid event ID", variant: "destructive" });
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // 2. Fetch data inside the async function
        const res = await apiFetch<EventDetails>(`/events/${eventIdNumber}`);
        
        if (res.error || !res.data) {
          toast({ title: "Event not found", variant: "destructive" });
        } else {
          setEvent(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [eventId, toast]);

  if (loading) return <div>Loading...</div>;
  if (!event) return <div>Event not found.</div>;

  return (
    <div>
      {/* Render your event details here */}
      <h1>{event.name}</h1>
    </div>
  );
};

export default EventDetailsPage;