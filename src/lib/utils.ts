import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, isAfter, isBefore, isToday } from "date-fns"; // Keep the imports

export function cn(...inputs: ClassValue[]) {
   return twMerge(clsx(inputs))
}

export function formatEventDate(dateString: string): string {
   const date = new Date(dateString);
   // ... rest of your formatting logic
   return format(date, "PPP"); 
}

export function isEventPast(dateString: string): boolean {
    const eventDate = new Date(dateString);
    const now = new Date();
    return isAfter(eventDate, now);
}