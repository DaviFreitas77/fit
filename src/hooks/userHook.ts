import { authClient } from "@/lib/auth-cliente";

export function useUser() {
  const {
    data: session,
    isPending,
    error,
    refetch,
  } = authClient.useSession();

  const user = session?.user ?? null;

  return {
    user,
    session,
    isPending,
    error,
    refetch,
    isAuthenticated: !!user,
  };
}



