import { auth } from "@/lib/auth";
import { formatLocalDateTime } from "@/lib/local-date-time";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

export async function fetchMeals() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return Response.json({ error: "Usuário não autenticado" }, { status: 401 });
  }

  const meals = await prisma.nutritionAnalyses.findMany({
    where: {
      fkUser: session.user.id,
    },
    include: {
      foods: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return Response.json(
    meals.map((meal) => ({
      ...meal,
      createdAt: formatLocalDateTime(meal.createdAt),
    })),
    { status: 200 },
  );
}
