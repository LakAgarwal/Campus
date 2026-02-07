import { api } from '@/api/client';

export const getClubData = () => {
  const club_id = sessionStorage.getItem('club_id');
  const club_name = sessionStorage.getItem('club_name');
  return { club_id, club_name };
};

export const fetchClubEvents = async (clubId: string) => {
  try {
    const data = await api.get<{ event_id: number; name: string; datetime: string }[]>(`/events?clubId=${clubId}`) || [];
    const now = new Date().toISOString();
    return data.filter((e: { datetime: string }) => e.datetime >= now).sort((a, b) => a.datetime.localeCompare(b.datetime));
  } catch (e) {
    console.error('Error fetching events:', e);
    return [];
  }
};

export const checkRegistrationValidity = async (eventId: number, userId: string) => {
  try {
    const regs = await api.get<{ event_id: number; user_id: string; is_valid: string }[]>(`/events/${eventId}/registrations`) || [];
    const r = regs.find((x: { user_id: string }) => x.user_id === userId);
    return r?.is_valid === 'true';
  } catch {
    return false;
  }
};

export const markRegistrationAsUsed = async (eventId: number, userId: string) => {
  try {
    await api.patch(`/events/registrations/${eventId}/user/${userId}`, { is_valid: 'false' });
    return true;
  } catch {
    return false;
  }
};

export const recordAttendance = async (eventId: number, userId: string) => {
  try {
    await api.post(`/events/${eventId}/attendance`, { user_id: userId });
    return true;
  } catch {
    return false;
  }
};
