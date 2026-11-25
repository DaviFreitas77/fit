import { fetchMeals } from "../../services/meals/fetch-meals-service";

export async function GET() {
  return fetchMeals();
}
