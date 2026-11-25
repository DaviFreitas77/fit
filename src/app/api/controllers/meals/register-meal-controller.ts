import { registerMeal } from "../../services/meals/register-meal-service";


export async function POST(request: Request) {
  return registerMeal(request);
}

