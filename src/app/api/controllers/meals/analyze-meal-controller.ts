import { analyseMeal } from "../../services/meals/analyse-meal-service";

export async function POST(request: Request) {
  return analyseMeal(request);
}
