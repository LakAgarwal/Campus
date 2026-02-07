import { api } from "@/api/client";

export interface Profile {
  id: string;
  user_id: string;
  username: string;
  full_name: string;
  avatar_url: string;
  created_at: string;
  updated_at: string;
  year?: string;
  year_of_branch: string;
  blood_group: string;
  email: string;
  year_of_study: number;
  branch: string;
  last_login: string;
}

export interface Club {
  club_id: string;
  name: string;
  description: string | null;
  category: string;
  status: 'Pending' | 'Approved';
  admin_id: string;
  created_at: string;
  updated_at: string;
  club_code?: string;
}

export interface Event {
  event_id: string;
  name: string;
  description: string | null;
  datetime: string;
  location: string;
  capacity: number;
  participants_count: number;
  status: "Open" | "Closed" | "Cancelled";
  category: string;
  club_id: string;
  club_name: string;
  created_at: string;
  updated_at: string;
}

const getApiQuery = (table: string) => {
  switch (table) {
    case 'profiles':
      return async () => {
        const profiles = await api.get<Profile[]>('/profiles') || [];
        return profiles.slice(0, 10);
      };
    case 'clubs':
      return async () => api.get<Club[]>('/clubs') || [];
    case 'events':
      return async () => api.get<Event[]>('/events') || [];
    case 'pending_clubs':
      return async () => {
        const clubs = await api.get<Club[]>('/clubs') || [];
        return clubs.filter((c: Club) => c.status === 'Pending');
      };
    case 'approve_club':
      return async (clubId: string) => {
        await api.patch('/clubs/' + clubId, { status: 'Active' });
        return {};
      };
    case 'user_insights':
      return async () => {
        const data = await api.get<{ created_at: string }[]>('/profiles') || [];
        const monthlyData = data.reduce((acc: Record<string, number>, item) => {
          const date = new Date(item.created_at);
          const key = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
          acc[key] = (acc[key] || 0) + 1;
          return acc;
        }, {});
        return Object.keys(monthlyData).map(name => ({ name, count: monthlyData[name] }));
      };
    case 'event_insights':
      return async () => {
        const data = await api.get<{ status: string }[]>('/events') || [];
        const statusCounts = data.reduce((acc: Record<string, number>, item) => {
          acc[item.status] = (acc[item.status] || 0) + 1;
          return acc;
        }, {});
        return Object.keys(statusCounts).map(name => ({ name, value: statusCounts[name] }));
      };
    default:
      return async () => {
        throw new Error(`No query defined for table: ${table}`);
      };
  }
};

export default getApiQuery;
