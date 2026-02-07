/**
 * API client for Spring Boot backend (replaces Supabase).
 */

const TOKEN_KEY = "club_scheduler_token";
const USER_ID_KEY = "club_scheduler_user_id";
const USER_EMAIL_KEY = "club_scheduler_user_email";

export function getApiBaseUrl(): string {
  const url = import.meta.env.VITE_API_BASE_URL;
  if (!url) {
    throw new Error("VITE_API_BASE_URL is not set in .env");
  }
  return url.replace(/\/$/, "");
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string, userId: string, email?: string): void {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_ID_KEY, userId);
  if (email) localStorage.setItem(USER_EMAIL_KEY, email);
}

export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_ID_KEY);
  localStorage.removeItem(USER_EMAIL_KEY);
}

export function getStoredUserId(): string | null {
  return localStorage.getItem(USER_ID_KEY);
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

export async function apiFetch<T = unknown>(
  path: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const base = getApiBaseUrl();
  const url = path.startsWith("http") ? path : `${base}${path.startsWith("/") ? path : `/${path}`}`;
  const token = getToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }
  try {
    const res = await fetch(url, { ...options, headers });
    const text = await res.text();
    let data: T | undefined;
    if (text) {
      try {
        data = JSON.parse(text) as T;
      } catch {
        data = undefined;
      }
    }
    if (!res.ok) {
      return {
        status: res.status,
        error: (data as { message?: string })?.message || res.statusText,
        data,
      };
    }
    return { status: res.status, data };
  } catch (err) {
    return {
      status: 0,
      error: err instanceof Error ? err.message : "Network error",
    };
  }
}

// Auth API
export interface SignInRequest {
  email: string;
  password: string;
}

export interface SignUpRequest {
  email: string;
  password: string;
  full_name: string;
  username: string;
  roll_number: string;
  year_of_study: number;
  branch: string;
  blood_group: string;
}

export interface AuthResponse {
  token: string;
  user_id: string;
  email: string;
}

export async function signIn(body: SignInRequest): Promise<ApiResponse<AuthResponse>> {
  return apiFetch<AuthResponse>("/auth/signin", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function signUp(body: SignUpRequest): Promise<ApiResponse<AuthResponse>> {
  return apiFetch<AuthResponse>("/auth/signup", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function getMe(): Promise<ApiResponse<unknown>> {
  return apiFetch("/auth/me");
}
