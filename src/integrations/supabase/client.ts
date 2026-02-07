/**
 * Supabase has been removed. This app uses Spring Boot + PostgreSQL.
 * Use: import { api, getCurrentUserId, clearAuthToken } from "@/api/client";
 */
const stub = () => {
  throw new Error("Supabase was removed. Use api from '@/api/client' and backend at VITE_API_URL.");
};
const fromStub = () => ({
  select: () => ({ eq: stub, in: stub, single: stub, maybeSingle: stub, order: stub, gte: stub, lte: stub, returns: stub, then: (resolve: (v: { data: null; error: Error }) => void) => resolve({ data: null, error: new Error("Use api.get()") }) }),
  insert: () => ({ select: stub, single: stub, then: (resolve: (v: { data: null; error: Error }) => void) => resolve({ data: null, error: new Error("Use api.post()") }) }),
  update: () => ({ eq: stub, then: stub }),
  delete: () => ({ eq: stub, then: stub }),
});
export const SUPABASE_URL = "";
export const SUPABASE_KEY = "";
export const supabase = {
  auth: {
    getSession: stub,
    getUser: stub,
    signInWithPassword: stub,
    signUp: stub,
    signOut: stub,
    onAuthStateChange: stub,
  },
  from: fromStub,
};
