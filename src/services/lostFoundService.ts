import { api } from '@/api/client';

export interface LostItem {
  id: number;
  user_id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  date_lost: string;
  contact_email: string;
  contact_phone?: string;
  image_base64: string;
  created_at?: string;
}

export interface FoundItem {
  id: number;
  user_id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  date_found: string;
  contact_email: string;
  contact_phone?: string;
  image_base64: string;
  created_at?: string;
}

export interface ItemDetails {
  id: number;
  user_id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  date: string;
  contact_email: string;
  contact_phone?: string;
  imageUrl: string;
  status: 'lost' | 'found';
  matches?: ItemDetails[];
}

const lostItemToDetails = (item: LostItem): ItemDetails => ({
  id: item.id,
  user_id: item.user_id,
  title: item.title,
  description: item.description,
  category: item.category,
  location: item.location,
  date: item.date_lost,
  contact_email: item.contact_email,
  contact_phone: item.contact_phone,
  imageUrl: item.image_base64,
  status: 'lost'
});

const foundItemToDetails = (item: FoundItem): ItemDetails => ({
  id: item.id,
  user_id: item.user_id,
  title: item.title,
  description: item.description,
  category: item.category,
  location: item.location,
  date: item.date_found,
  contact_email: item.contact_email,
  contact_phone: item.contact_phone,
  imageUrl: item.image_base64,
  status: 'found'
});

export const getLostItems = async (): Promise<ItemDetails[]> => {
  const data = await api.get<LostItem[]>('/lost-found/lost');
  return (data || []).map(lostItemToDetails);
};

export const getFoundItems = async (): Promise<ItemDetails[]> => {
  const data = await api.get<FoundItem[]>('/lost-found/found');
  return (data || []).map(foundItemToDetails);
};

export const getLostItemsByUserId = async (userId: string): Promise<ItemDetails[]> => {
  const data = await api.get<LostItem[]>(`/lost-found/lost/user/${userId}`);
  return (data || []).map(lostItemToDetails);
};

export const getFoundItemsByUserId = async (userId: string): Promise<ItemDetails[]> => {
  const data = await api.get<FoundItem[]>(`/lost-found/found/user/${userId}`);
  return (data || []).map(foundItemToDetails);
};

export const addLostItem = async (item: Omit<LostItem, 'id' | 'created_at'>): Promise<ItemDetails> => {
  const data = await api.post<LostItem>('/lost-found/lost', item);
  return lostItemToDetails(data);
};

export const addFoundItem = async (item: Omit<FoundItem, 'id' | 'created_at'>): Promise<ItemDetails> => {
  const data = await api.post<FoundItem>('/lost-found/found', item);
  return foundItemToDetails(data);
};

export const findMatchesForLostItem = async (lostItem: ItemDetails): Promise<ItemDetails[]> => {
  const data = await api.get<FoundItem[]>(`/lost-found/found/matches?category=${encodeURIComponent(lostItem.category)}`);
  return (data || []).map(foundItemToDetails);
};

export const findMatchesForFoundItem = async (foundItem: ItemDetails): Promise<ItemDetails[]> => {
  const data = await api.get<LostItem[]>(`/lost-found/lost/matches?category=${encodeURIComponent(foundItem.category)}`);
  return (data || []).map(lostItemToDetails);
};

// Re-export for components that use these names
export { lostItemToDetails, foundItemToDetails };
