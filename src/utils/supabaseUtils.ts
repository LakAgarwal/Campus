import { api } from '@/api/client';

export async function fetchUserDetails(userId: string): Promise<{ full_name: string } | null> {
  try {
    const data = await api.get<{ full_name: string }>(`/profiles/${userId}`);
    return data;
  } catch (error) {
    console.error('Error fetching user details:', error);
    throw error;
  }
}
