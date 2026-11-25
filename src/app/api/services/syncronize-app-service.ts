import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { ProfileDTO } from "../dtos/user/user-dto";
import { MealAnalysisDTO } from "../dtos/meals/analyze-meal-dto";

export async function syncApp(request: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const body = await request.json();
  console.log("syncApp body", body);

  const profile: ProfileDTO = {
    name: body.profile.name,
    age: body.profile.age,
    weight: body.profile.weight,
    height: body.profile.height,
    gender: body.profile.sex,
    activity: body.profile.activity,
    goal: body.profile.goal,
  };

  const meals = body.meals.map((meal: MealAnalysisDTO) => ({
    name: meal.name,
    calories: Math.round(meal.calories),
    protein: Math.round(meal.protein),
    carbs: Math.round(meal.carbs),
    fat: Math.round(meal.fat),
    category: meal.category,
    time: meal.time,
  }));

  const detailsMeals = body.meals.map((meal: MealAnalysisDTO) => ({
    name: meal.name,
    calories: Math.round(meal.calories),
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
      await prisma.$transaction(async (tx) => {
        for (let i = 0; i < meals.length; i++) {
          const analyse = await tx.nutritionAnalyses.create({
            data: {
              ...meals[i],
              fkUser: session.user.id,
            },
          });

          await tx.detailsAnalyses.create({
            data: {
              ...detailsMeals[i],
              fkAnalyse: analyse.id,
            },
          });
        }
      });
    }
    return Response.json(
      { message: "Dados sincronizados com sucesso" },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.log(error.code);
    }

    return Response.json(
      { error: "Erro ao atualizar perfil" },
      { status: 500 },
    );
  }
}
