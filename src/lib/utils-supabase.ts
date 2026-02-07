// Dashboard/utils – uses Spring Boot API (PostgreSQL backend)
import { api } from "@/api/client";

interface NewsletterOptions {
  page?: number;
  limit?: number;
}
interface EventOptions {
  status?: string;
  clubId?: string;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}
interface EventStatsOptions {
  timeframe?: 'day' | 'week' | 'month' | 'year';
}
interface ClubOptions {
  category?: string;
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}
interface UserOptions {
  yearOfBranch?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export async function fetchAllClubs(options: ClubOptions = {}) {
  const { page = 1, limit = 10 } = options;
  const data = await api.get<unknown[]>('/clubs') || [];
  const count = data.length;
  const start = (page - 1) * limit;
  return { data: data.slice(start, start + limit), count, page, limit };
}

export async function fetchNewsletters(options: NewsletterOptions = {}) {
  const { page = 1, limit = 10 } = options;
  const data = await api.get<unknown[]>('/newsletters') || [];
  const count = data.length;
  const start = (page - 1) * limit;
  return { data: data.slice(start, start + limit), count, page, limit };
}

export async function createNewsletter(heading: string, content: string) {
  return api.post('/newsletters', { heading, content, created_by: 'Admin' });
}

export async function deleteNewsletter(id: string) {
  await api.delete('/newsletters/' + id);
  return true;
}

export async function approveClub(clubId: number) {
  await api.patch('/clubs/' + clubId, { status: 'Active' });
  return {};
}

export async function banClub(clubId: number) {
  await api.patch('/clubs/' + clubId, { status: 'Banned' });
  return {};
}

export async function fetchEvents(options: EventOptions = {}) {
  const { clubId, page = 1, limit = 10 } = options;
  const path = clubId ? '/events?clubId=' + clubId : '/events';
  const data = await api.get<unknown[]>(path) || [];
  const count = data.length;
  const start = (page - 1) * limit;
  return { data: data.slice(start, start + limit), count, page, limit };
}

export async function fetchUsers(options: UserOptions = {}) {
  const { page = 1, limit = 10 } = options;
  const data = await api.get<unknown[]>('/profiles') || [];
  const count = data.length;
  const start = (page - 1) * limit;
  return { data: data.slice(start, start + limit), count, page, limit };
}

export async function fetchUserStats(_timeframe = 'week') {
  const data = await api.get<unknown[]>('/profiles') || [];
  return data;
}

export async function fetchEventStats(_options: EventStatsOptions = {}) {
  const data = await api.get<unknown[]>('/events') || [];
  return data;
}

export async function fetchEventRegistrations() {
  return api.get<unknown[]>('/events/my-registrations') || [];
}

// No realtime – use polling if needed
export function subscribeToClubApprovals(_callback: () => void) {
  return { unsubscribe: () => {} };
}
export function subscribeToNewEvents(_callback: () => void) {
  return { unsubscribe: () => {} };
}
export function subscribeToNewsletters(_callback: () => void) {
  return { unsubscribe: () => {} };
}

export async function getDashboardStats() {
  const [profiles, clubs, events, newsletters] = await Promise.all([
    api.get<unknown[]>('/profiles').catch(() => []),
    api.get<unknown[]>('/clubs').catch(() => []),
    api.get<unknown[]>('/events').catch(() => []),
    api.get<unknown[]>('/newsletters').catch(() => []),
  ]);
  const counts = {
    users: Array.isArray(profiles) ? profiles.length : 0,
    clubs: Array.isArray(clubs) ? clubs.length : 0,
    events: Array.isArray(events) ? events.length : 0,
    registrations: 0,
    pendingClubs: 0,
    newsletters: Array.isArray(newsletters) ? newsletters.length : 0,
  };
  const recentUsers = Array.isArray(profiles) ? profiles.slice(0, 5) : [];
  const pendingClubs = Array.isArray(clubs) ? clubs.slice(0, 10) : [];
  const upcomingEvents = Array.isArray(events) ? events.slice(0, 5) : [];
  const recentNewsletters = Array.isArray(newsletters) ? newsletters.slice(0, 3) : [];
  return {
    counts,
    recentUsers,
    pendingClubs,
    upcomingEvents,
    recentNewsletters,
  };
}
