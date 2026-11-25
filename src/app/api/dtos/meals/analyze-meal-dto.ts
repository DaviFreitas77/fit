export interface AnalyzeMealDTO {
  description: string;
  hour?: number;
}

export interface MealAnalysisDTO {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  category: string;
  time: string;
  foods: {
    name: string;
    calories: number;
  }[];
}


export interface MealSync {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}


export interface RegisterMealDTO {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  category: string;
  time: string;
  /** Local wall-clock value formatted as YYYY-MM-DDTHH:mm:ss, without a timezone. */
  createdAt: string;
  foods: {
    name: string;
    calories: number;
  }[];
}
