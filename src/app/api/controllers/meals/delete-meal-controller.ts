import { deleteMeal } from "@/app/api/services/meals/delete-meal.service";

export async function DELETE(request: Request) {
  const body = await request.json();


  return deleteMeal(body.id);
}
