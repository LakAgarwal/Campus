import { useAuthContext } from "@/contexts/AuthContext";

export function useAuth() {
   const context = useAuthContext();
   // ... return your context values like user, loading, hasSession
   return context;
}