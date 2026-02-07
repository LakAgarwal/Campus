/**
 * API client for Campus SETU Spring Boot backend.
 * Base URL: VITE_API_URL (default http://localhost:8080/api)
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

function getToken(): string | null {
  return localStorage.getItem('access_token');
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const text = await res.text();
    let errMessage = text;
    try {
      const j = JSON.parse(text);
      errMessage = j.error || j.message || text;
    } catch {
      // use text as is
    }
    throw new Error(errMessage || `HTTP ${res.status}`);
  }

  const contentType = res.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return res.json() as Promise<T>;
  }
  return res.text() as Promise<T>;
}

export const api = {
  get: <T>(path: string) => apiRequest<T>(path, { method: 'GET' }),
  post: <T>(path: string, body?: unknown) =>
    apiRequest<T>(path, { method: 'POST', body: body ? JSON.stringify(body) : undefined }),
  put: <T>(path: string, body?: unknown) =>
    apiRequest<T>(path, { method: 'PUT', body: body ? JSON.stringify(body) : undefined }),
  patch: <T>(path: string, body?: unknown) =>
    apiRequest<T>(path, { method: 'PATCH', body: body ? JSON.stringify(body) : undefined }),
  delete: <T>(path: string) => apiRequest<T>(path, { method: 'DELETE' }),
};

// Auth
export interface AuthUser {
  id: string;
  email?: string;
}

export interface AuthResponse {
  accessToken: string;
  tokenType?: string;
  userId: string;
  email: string;
  user: AuthUser;
}

const USER_ID_KEY = 'user_id';

export function setAuthToken(token: string) {
  localStorage.setItem('access_token', token);
}

export function setUserId(userId: string) {
  localStorage.setItem(USER_ID_KEY, userId);
}

export function clearAuthToken() {
  localStorage.removeItem('access_token');
  localStorage.removeItem(USER_ID_KEY);
}

export function getCurrentUserId(): string | null {
  return localStorage.getItem(USER_ID_KEY);
}

export function getAuthToken(): string | null {
  return getToken();
}

export async function authLogin(email: string, password: string): Promise<AuthResponse> {
  const data = await api.post<AuthResponse>('/auth/login', { email, password });
  if (data.accessToken) setAuthToken(data.accessToken);
  if (data.userId) setUserId(data.userId);
  return data;
}

export async function authRegister(body: {
  email: string;
  password: string;
  fullName: string;
  username: string;
  rollNumber: string;
  yearOfStudy: number;
  branch: string;
  bloodGroup: string;
}): Promise<AuthResponse> {
  const data = await api.post<AuthResponse>('/auth/register', body);
  if (data.accessToken) setAuthToken(data.accessToken);
  if (data.userId) setUserId(data.userId);
  return data;
}

export async function authSession(): Promise<{ session: { user: AuthUser } | null }> {
  try {
    const res = await api.get<{ session: { user: AuthUser } | null }>('/auth/session');
    return res;
  } catch {
    return { session: null };
  }
}

// Club auth (no JWT; sessionStorage handled by frontend)
export async function clubAuthLogin(clubCode: string, password: string) {
  return api.post<{
    club_id: number;
    clubs: { name: string; category: string; admin_id: string };
    status: string;
  }>('/club-auth/login', { clubCode: clubCode.trim().toUpperCase(), password });
}

// Admin auth
export async function adminAuthLogin(adminCode: string, password: string) {
  return api.post<{ id: string; admin_code: string }>('/admin-auth/login', {
    adminCode: adminCode.trim(),
    password,
  });
}
