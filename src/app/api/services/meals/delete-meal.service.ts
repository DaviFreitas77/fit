import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";


export async function deleteMeal(mealId: string) {
 
  const existingMeal = await prisma.nutritionAnalyses.findUnique({
    where: { id: mealId },
  });

  if (!existingMeal) {
    return Response.json({ error: "Refeição não encontrada" }, { status: 404 });
  }

  await prisma.nutritionAnalyses.delete({
    where: { id: mealId },
  });

  const existingFoods = await prisma.detailsAnalyses.findMany({
    where: { fkAnalyse: mealId },
  });

  if (existingFoods.length > 0) {
    await prisma.detailsAnalyses.deleteMany({
      where: { fkAnalyse: mealId },
    });
  }

  return Response.json(
    { message: "Refeição deletada com sucesso" },
    { status: 200 },
  );
}
