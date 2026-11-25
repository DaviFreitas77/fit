"use client";

import { useQuery } from "@tanstack/react-query";
import { useUser } from "./userHook";
import type { Meal } from "@/lib/nutrition";

export type RegisteredMeal = Meal & {
  fkUser: string;
  createdAt: string;
};

async function fetchMeals(): Promise<RegisteredMeal[]> {
  const response = await fetch("/api/meal", { cache: "no-store" });
  if (!response.ok) {
    const result = await response.json().catch(() => null);
    throw new Error(result?.error || "Não foi possível carregar as refeições.");
  }

  return response.json();
}

export function mealsQueryKey(userId?: string) {
  return ["meals", userId] as const;
}

export function useMeals() {
  const { user, isPending } = useUser();

  return useQuery({
    queryKey: mealsQueryKey(user?.id),
    queryFn: fetchMeals,
    enabled: !isPending && Boolean(user),
  });
}
