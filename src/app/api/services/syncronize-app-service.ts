import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { ProfileDTO } from "../dtos/user/user-dto";
import { MealAnalysisDTO } from "../dtos/meals/analyze-meal-dto";

export async function syncApp(request: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const body = await request.json();

  const profile: ProfileDTO = {
    name: body.profile.name,
    age: body.profile.age,
    weight: body.profile.weight,
    height: body.profile.height,
    gender: body.profile.sex,
    activity: body.profile.activity,
    goal: body.profile.goal,
  };

  const incomingMeals = (body.meals ?? []) as MealAnalysisDTO[];
  const meals = incomingMeals.map((meal) => ({
    id: meal.id ?? crypto.randomUUID(),
    name: meal.name,
    calories: Math.round(meal.calories),
    protein: Math.round(meal.protein),
    carbs: Math.round(meal.carbs),
    fat: Math.round(meal.fat),
    category: meal.category,
    time: meal.time,
    createdAt: meal.createdAt ?? "",
    foods: meal.foods ?? [],
  }));

  if (!session) {
    return Response.json({ error: "Usuário não autenticado" }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
    });

    if (!user) {
      return Response.json(
        { error: "Usuário não encontrado" },
        { status: 404 },
      );
    }

    await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        name: profile.name,
        age: profile.age,
        weight: profile.weight,
        height: profile.height,
        gender: profile.gender,
        activity: profile.activity,
        goal: profile.goal,
      },
    });

    if (meals.length > 0) {
      const existingMeals = await prisma.nutritionAnalyses.findMany({
        where: {
          fkUser: session.user.id,
          id: { in: meals.map((meal) => meal.id) },
        },
        select: { id: true },
      });
      const existingIds = new Set(existingMeals.map((meal) => meal.id));
      const mealsToInsert = meals.filter((meal) => !existingIds.has(meal.id));

      if (mealsToInsert.length > 0) {
        await prisma.$transaction(async (tx) => {
          for (const meal of mealsToInsert) {
            await tx.nutritionAnalyses.create({
              data: {
                id: meal.id,
                name: meal.name,
                calories: meal.calories,
                protein: meal.protein,
                carbs: meal.carbs,
                fat: meal.fat,
                category: meal.category,
                time: meal.time,
                createdAt: meal.createdAt,
                fkUser: session.user.id,
                foods: {
                  create: meal.foods.map((food) => ({
                    name: food.name,
                    calories: Math.round(food.calories),
                  })),
                },
              },
            });
          }
        });
      }
    }
    return Response.json(
      { message: "Dados sincronizados com sucesso" },
      { status: 200 },
    );
  } catch (error) {
    console.error("ERRO NO SYNC:", error);

    throw error;
  }
}
