export interface AnalyzeMealDTO {
  description: string;
}

export interface MealAnalysisDTO {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  foods: {
    name: string;
    calories: number;
  }[];
}