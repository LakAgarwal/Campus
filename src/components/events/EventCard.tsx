import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Bookmark, Share2, Info } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Event } from "@/types/event";
import { getCategoryColor } from "@/utils/styles";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

interface EventCardProps {
  event: Event;
  viewMode: "grid" | "list";
  isMobileView: boolean;
  onRegister: (eventId: number) => void;
  onSave: (eventId: number) => void;
  onShare: (eventId: number) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "Open":
      return "bg-primary hover:bg-primary/90";
    case "Closing Soon":
      return "bg-amber-500 hover:bg-amber-600";
    case "Waitlist":
      return "bg-purple-500 hover:bg-purple-600";
    case "Closed":
      return "bg-gray-500 hover:bg-gray-600";
    case "Cancelled":
      return "bg-red-500 hover:bg-red-600";
    default:
      return "bg-gray-500 hover:bg-gray-600";
  }
};

const EventCard = ({
  event,
  viewMode,
  isMobileView,
  onRegister,
  onSave,
  onShare,
}: EventCardProps) => {
  const deadlineDate = new Date(event.registration_deadline);
  const timeLeft = deadlineDate.getTime() - new Date().getTime();
  const isUrgent = timeLeft < 48 * 60 * 60 * 1000; // 48 hours

  const DeadlineBadge = () => (
    <Badge
      variant="outline"
      className={`
        font-normal whitespace-nowrap px-2 min-w-[120px] text-center
        ${isUrgent ? "text-red-500 border-red-200" : ""}
      `}
    >
      Deadline: {deadlineDate.toLocaleDateString()}
    </Badge>
  );

  if (viewMode === "grid" && !isMobileView) {
    return (
      <Card className="overflow-hidden h-full flex flex-col group hover:shadow-lg transition-all duration-300 dark:bg-gray-800">
        <div className="relative h-48 overflow-hidden">
          <img
            src={event.event_thumbnail}
            alt={event.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute top-0 right-0 p-2 flex flex-wrap gap-1 justify-end max-w-[80%]">
            {event.tags.map((tag, index) => (
              <Badge
                key={index}
                className={`
                  font-medium text-xs px-2 py-0.5
                  backdrop-blur-md bg-opacity-90
                  shadow-sm
                  transform transition-all duration-300
                  hover:scale-105 hover:shadow-md
                  ${getCategoryColor(tag)}
                `}
              >
                {tag}
              </Badge>
            ))}
          </div>
          
          {/* View Details Overlay */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <Link 
              to={`/event/${event.event_id}`}
              className="bg-white/90 hover:bg-white text-primary font-medium px-4 py-2 rounded-md flex items-center gap-2 transform transition-transform duration-300 hover:scale-105"
            >
              <Info className="h-4 w-4" />
              View Details
            </Link>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
            <h3 className="text-white font-semibold line-clamp-2 group-hover:text-primary transition-colors">
              {event.name}
            </h3>
            <p className="text-white/90 text-sm mt-1">
              Organized by {event.club_name}
            </p>
          </div>
        </div>
        <CardContent className="flex-grow p-4 space-y-3">
          <div className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-300">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-primary" />
              <span>{new Date(event.datetime).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-primary" />
              <span>{new Date(event.datetime).toLocaleTimeString()}</span>
            </div>
          </div>

          <div className="flex items-start gap-1.5 text-sm text-gray-600 dark:text-gray-300">
            <MapPin className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
            <span>{event.location}</span>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
            {event.short_description}
          </p>

          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>Eligibility: {event.eligibility}</span>
            <DeadlineBadge />
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex gap-2">
          <Button
            className={`flex-1 text-white shadow-sm hover:shadow-md transition-all duration-300 ${getStatusColor(
              event.status
            )}`}
            onClick={() => onRegister(event.event_id)}
            disabled={event.status !== "Open"}
          >
            {event.status === "Open" ? "Register" : event.status}
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onSave(event.event_id)}
            className="hover:bg-primary/10 transition-colors"
          >
            <Bookmark className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onShare(event.event_id)}
            className="hover:bg-primary/10 transition-colors"
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden flex group hover:shadow-lg transition-all duration-300 dark:bg-gray-800">
      <div className="relative h-auto w-32 sm:w-48 overflow-hidden">
        <img
          src={event.event_thumbnail}
          alt={event.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-0 right-0 p-2">
          {event.tags.map((tag, index) => (
            <Badge
              key={index}
              className={`
                font-medium text-xs px-2 py-0.5
                backdrop-blur-md bg-opacity-90
                shadow-sm
                transform transition-all duration-300
                hover:scale-105 hover:shadow-md
                ${getCategoryColor(tag)}
              `}
            >
              {tag}
            </Badge>
          ))}
        </div>
        
        {/* View Details Overlay */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Link 
            to={`/event/${event.event_id}`}
            className="bg-white/90 hover:bg-white text-primary text-sm font-medium px-3 py-1.5 rounded-md flex items-center gap-1.5 transform transition-transform duration-300 hover:scale-105"
          >
            <Info className="h-3 w-3" />
            Details
          </Link>
        </div>
      </div>
      <div className="flex flex-col flex-grow p-4">
        <div className="mb-3">
          <h3 className="font-semibold text-lg group-hover:text-primary transition-colors line-clamp-1">
            {event.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Organized by {event.club_name}
          </p>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300 mb-2">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-primary" />
            <span>{new Date(event.datetime).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-primary" />
            <span>{new Date(event.datetime).toLocaleTimeString()}</span>
          </div>
        </div>

        <div className="flex items-start gap-1.5 text-sm text-gray-600 dark:text-gray-300 mb-2">
          <MapPin className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
          <span>{event.location}</span>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-3">
          {event.short_description}
        </p>

        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3">
          <span>Eligibility: {event.eligibility}</span>
          <DeadlineBadge />
        </div>

        <div className="flex gap-2 mt-auto">
          <Button
            className={`flex-1 text-white shadow-sm hover:shadow-md transition-all duration-300 ${getStatusColor(
              event.status
            )}`}
            onClick={() => onRegister(event.event_id)}
            disabled={event.status !== "Open"}
          >
            {event.status === "Open" ? "Register" : event.status}
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onSave(event.event_id)}
            className="hover:bg-primary/10 transition-colors"
          >
            <Bookmark className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onShare(event.event_id)}
            className="hover:bg-primary/10 transition-colors"
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default EventCard;
