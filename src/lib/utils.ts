import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, isAfter, isBefore, isToday, parseISO } from "date-fns";

export function cn(...inputs: ClassValue[]) {
   return twMerge(clsx(inputs))
}

export function formatEventDate(dateString: string): string {
   const date = new Date(dateString);
   return format(date, "PPP"); 
}

// FIX 1: Add missing formatShortDate
export function formatShortDate(dateString: string): string {
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : new Date(dateString);
    return format(date, "MMM d, yyyy");
  } catch (error) {
    return dateString;
  }
}

export function isEventPast(dateString: string): boolean {
    const eventDate = new Date(dateString);
    const now = new Date();
    return isBefore(eventDate, now); // Fixed logic: past means event is BEFORE now
}

// FIX 2: Add missing isEventOngoing
export function isEventOngoing(dateString: string): boolean {
  const eventDate = new Date(dateString);
  return isToday(eventDate);
}