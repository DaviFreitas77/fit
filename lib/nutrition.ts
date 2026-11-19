export type Profile = {
  name: string;
  sex: "female" | "male";
  age: number;
  weight: number;
  height: number;
  activity: number;
  goal: number;
};

export type MealCategory =
  | "Café da manhã"
  | "Almoço"
  | "Café da tarde"
  | "Ceia";

export type Meal = {
  id: string;
  name: string;
  category: MealCategory;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  time: string;
};

export type DayData = Record<string, Meal[]>;

export type MealDraft = {
  name: string;
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
};

export const defaultProfile: Profile = {
  name: "",
  sex: "male",
  age: 30,
  weight: 75,
  height: 175,
  activity: 1.55,
  goal: -300,
};

export const activityLevels = [
  {
    value: 1.2,
    label: "Sedentário",
    description: "Pouco ou nenhum exercício. Rotina predominantemente sentado.",
  },
  {
    value: 1.375,
    label: "Levemente ativo",
    description: "Exercícios leves ou atividades físicas de 1 a 3 dias por semana.",
  },
  {
    value: 1.55,
    label: "Moderadamente ativo",
    description: "Exercícios moderados de 3 a 5 dias por semana.",
  },
  {
    value: 1.725,
    label: "Muito ativo",
    description: "Treinos intensos de 6 a 7 dias por semana.",
  },
] as const;

export function dateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "short",
  }).format(date);
}

export function getGreeting(date = new Date()) {
  const hour = date.getHours();
  if (hour >= 5 && hour < 12) return "Bom dia";
  if (hour >= 12 && hour < 18) return "Boa tarde";
  return "Boa noite";
}

export function calculateBMR(profile: Profile) {
  const sexOffset = profile.sex === "male" ? 5 : -161;
  return 10 * profile.weight + 6.25 * profile.height - 5 * profile.age + sexOffset;
}
