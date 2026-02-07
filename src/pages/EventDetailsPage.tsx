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
      const eventIdNumber = eventId ? parseInt(eventId, 10) : 0;
      
      if (isNaN(eventIdNumber) || eventIdNumber === 0) {
        toast({ title: "Invalid event ID", variant: "destructive" });
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
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

  if (loading) return <div className="flex justify-center p-10">Loading...</div>;
  if (!event) return <div className="flex justify-center p-10">Event not found.</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold">{event.name}</h1>
      <p className="mt-4 text-gray-600">{event.short_description}</p>
    </div>
  );
};

export default EventDetailsPage;