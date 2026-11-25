import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import type { RegisterMealDTO } from "../../dtos/meals/analyze-meal-dto";
import {
  formatLocalDateTime,
  parseLocalDateTime,
} from "@/lib/local-date-time";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isRegisterMealDTO(value: unknown): value is RegisterMealDTO {
  if (!isRecord(value) || !Array.isArray(value.foods)) return false;

  return (
    typeof value.name === "string" &&
    value.name.trim().length > 0 &&
    typeof value.category === "string" &&
    value.category.length > 0 &&
    typeof value.createdAt === "string" &&
    parseLocalDateTime(value.createdAt) !== null &&
    typeof value.time === "string" &&
    /^([01]\d|2[0-3]):[0-5]\d$/.test(value.time) &&
    Number.isFinite(value.calories) &&
    Number.isFinite(value.protein) &&
    Number.isFinite(value.carbs) &&
    Number.isFinite(value.fat) &&
    value.foods.every(
      (food) =>
        isRecord(food) &&
        typeof food.name === "string" &&
        Number.isFinite(food.calories),
    )
  );
}

export async function registerMeal(request: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return Response.json({ error: "Usuário não autenticado" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Corpo JSON inválido" }, { status: 400 });
  }

  if (!isRegisterMealDTO(body)) {
    return Response.json(
      { error: "Dados da refeição inválidos" },
      { status: 400 },
    );
  }

  const analyseMeal = body;
  const createdAt = parseLocalDateTime(analyseMeal.createdAt);
  if (!createdAt) {
    return Response.json(
      { error: "Data e horário inválidos" },
      { status: 400 },
    );
  }

  try {
    const analyse = await prisma.nutritionAnalyses.create({
      data: {
        name: analyseMeal.name,
        calories: Math.round(analyseMeal.calories),
        carbs: Math.round(analyseMeal.carbs),
        fat: Math.round(analyseMeal.fat),
        protein: Math.round(analyseMeal.protein),
        category: analyseMeal.category,
        fkUser: session.user.id,
        time: analyseMeal.time,
        createdAt,
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
      { ...analyse, createdAt: formatLocalDateTime(analyse.createdAt) },
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
