import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import type { RegisterMealDTO } from "../../dtos/meals/analyze-meal-dto";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function registerMeal(request: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return Response.json({ error: "Usuário não autenticado" }, { status: 401 });
  }

  const body = (await request.json()) as RegisterMealDTO;

  const analyseMeal: RegisterMealDTO = {
    id: body.id,
    name: body.name,
    calories: body.calories,
    protein: body.protein,
    carbs: body.carbs,
    fat: body.fat,
    category: body.category,
    time: body.time,
    foods: body.foods,
    createdAt: body.createdAt,
  };

  try {
    const analyse = await prisma.nutritionAnalyses.create({
      data: {
        ...(analyseMeal.id ? { id: analyseMeal.id } : {}),
        name: analyseMeal.name,
        calories: Math.round(analyseMeal.calories),
        carbs: Math.round(analyseMeal.carbs),
        fat: Math.round(analyseMeal.fat),
        protein: Math.round(analyseMeal.protein),
        category: analyseMeal.category,
        fkUser: session.user.id,
        time: analyseMeal.time,
        createdAt: analyseMeal.createdAt,
        foods: {
          create: analyseMeal.foods.map((food) => ({
            name: food.name,
            calories: Math.round(food.calories),
          })),
        },
      },
      include: { foods: true },
    });
    return Response.json(
      { ...analyse, createdAt: analyse.createdAt },
      { status: 201 },
    );
  } catch (error) {
    console.error("Erro ao registrar refeição:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return new Response(JSON.stringify({ error: "Database error" }), {
        status: 500,
      });
    }
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
