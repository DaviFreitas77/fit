import { authClient } from "@/lib/auth-cliente";
import { Meal, Profile } from "@/lib/nutrition";

export function useUser() {
  const { data: session, isPending, error, refetch } = authClient.useSession();

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

export async function syncUser(profile: Profile, meals: Meal[]) {
  try {
    const response = await fetch("/api/sync", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        profile,
        meals,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to sync user profile");
    }

    const data = await response.json();

    
    return data;
  } catch (error) {
    console.error("Error syncing user profile:", error);
  }
}
