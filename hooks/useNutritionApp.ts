"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  calculateBMR,
  dateKey,
  defaultProfile,
  getGreeting,
  type DayData,
  type Meal,
  type MealDraft,
  type Profile,
} from "@/lib/nutrition";

export function useNutritionApp() {
  const [profile, setProfile] = useState<Profile>(defaultProfile);
  const [days, setDays] = useState<DayData>({});
  const [selectedDate, setSelectedDate] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const [mealOpen, setMealOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [profileConfigured, setProfileConfigured] = useState(false);
  const [greeting, setGreeting] = useState("Olá");
  const [activityChoice, setActivityChoice] = useState(1.55);
  const [mealDescription, setMealDescription] = useState("");
  const [mealDraft, setMealDraft] = useState<MealDraft>({
    name: "",
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
  });
  const [analyzingMeal, setAnalyzingMeal] = useState(false);
  const [mealError, setMealError] = useState("");

  useEffect(() => {
    queueMicrotask(() => {
      setSelectedDate(dateKey(new Date()));
      setGreeting(getGreeting());
      const savedProfile = localStorage.getItem("nutrition-profile");
      const savedDays = localStorage.getItem("nutrition-days");
      if (savedProfile) {
        const parsed = { name: "", ...JSON.parse(savedProfile) } as Profile;
        setProfile(parsed);
        setActivityChoice(parsed.activity);
        setProfileConfigured(Boolean(parsed.name));
      }
      if (savedDays) setDays(JSON.parse(savedDays));
      setLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem("nutrition-profile", JSON.stringify(profile));
  }, [profile, loaded]);

  useEffect(() => {
    if (loaded) localStorage.setItem("nutrition-days", JSON.stringify(days));
  }, [days, loaded]);

  useEffect(() => {
    const update = () => setGreeting(getGreeting());
    const timer = window.setInterval(update, 60_000);
    window.addEventListener("focus", update);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("focus", update);
    };
  }, []);

  const bmr = useMemo(() => calculateBMR(profile), [profile]);
  const maintenance = useMemo(() => bmr * profile.activity, [bmr, profile.activity]);
  const target = Math.round(maintenance + profile.goal);
  const meals = useMemo(() => selectedDate ? days[selectedDate] ?? [] : [], [days, selectedDate]);
  const totals = useMemo(() => meals.reduce(
    (sum, meal) => ({
      calories: sum.calories + meal.calories,
      protein: sum.protein + meal.protein,
      carbs: sum.carbs + meal.carbs,
      fat: sum.fat + meal.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 },
  ), [meals]);

  const remaining = target - totals.calories;
  const progress = target > 0 ? Math.min((totals.calories / target) * 100, 100) : 0;
  const macroTargets = {
    protein: Math.round(profile.weight * 2),
    carbs: Math.round((target * 0.45) / 4),
    fat: Math.round((target * 0.25) / 9),
  };

  const weekDays = useMemo(() => {
    if (!selectedDate) return [];
    const today = dateKey(new Date());
    const selected = new Date(`${selectedDate}T12:00:00`);
    const monday = new Date(selected);
    monday.setDate(selected.getDate() - ((selected.getDay() + 6) % 7));
    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + index);
      return {
        key: dateKey(date),
        future: dateKey(date) > today,
        short: new Intl.DateTimeFormat("pt-BR", { weekday: "short" }).format(date).replace(".", ""),
        number: date.getDate(),
      };
    });
  }, [selectedDate]);

  function shiftDate(offset: number) {
    const date = new Date(`${selectedDate}T12:00:00`);
    date.setDate(date.getDate() + offset);
    const today = new Date();
    today.setHours(12, 0, 0, 0);
    if (date <= today) setSelectedDate(dateKey(date));
  }

  const nextWeekLocked = useMemo(() => {
    if (!selectedDate) return true;
    const today = new Date();
    const selected = new Date(`${selectedDate}T12:00:00`);
    const currentMonday = new Date(today);
    currentMonday.setDate(today.getDate() - ((today.getDay() + 6) % 7));
    const selectedMonday = new Date(selected);
    selectedMonday.setDate(selected.getDate() - ((selected.getDay() + 6) % 7));
    return selectedMonday >= currentMonday;
  }, [selectedDate]);

  function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const goalType = form.get("goalType");
    const signedGoal = goalType === "surplus" ? 300 : -300;
    setProfile({
      name: String(form.get("name")).trim(),
      sex: form.get("sex") as Profile["sex"],
      age: Number(form.get("age")),
      weight: Number(form.get("weight")),
      height: Number(form.get("height")),
      activity: Number(form.get("activity")),
      goal: signedGoal,
    });
    setActivityChoice(Number(form.get("activity")));
    setProfileConfigured(true);
    setProfileOpen(false);
  }

  function addMeal(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const meal: Meal = {
      id: crypto.randomUUID(),
      name: String(form.get("name")).trim(),
      category: form.get("category") as Meal["category"],
      calories: Number(form.get("calories")),
      protein: Number(form.get("protein") || 0),
      carbs: Number(form.get("carbs") || 0),
      fat: Number(form.get("fat") || 0),
      time: new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit" }).format(new Date()),
    };
    setDays((current) => ({
      ...current,
      [selectedDate]: [meal, ...(current[selectedDate] ?? [])],
    }));
    setMealOpen(false);
  }

  function removeMeal(id: string) {
    setDays((current) => ({
      ...current,
      [selectedDate]: (current[selectedDate] ?? []).filter((meal) => meal.id !== id),
    }));
  }

  async function analyzeMeal() {
    if (!mealDescription.trim()) {
      setMealError("Escreva o que você comeu.");
      return;
    }
    setAnalyzingMeal(true);
    setMealError("");
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 20_000);
    try {
      const response = await fetch("/api/analyze-meal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: mealDescription }),
        signal: controller.signal,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Não foi possível analisar a refeição.");
      setMealDraft({
        name: data.name,
        calories: String(data.calories),
        protein: String(data.protein),
        carbs: String(data.carbs),
        fat: String(data.fat),
      });
    } catch (error) {
      setMealError(
        error instanceof DOMException && error.name === "AbortError"
          ? "A análise demorou demais. Tente novamente."
          : error instanceof Error ? error.message : "Erro ao analisar a refeição.",
      );
    } finally {
      window.clearTimeout(timeout);
      setAnalyzingMeal(false);
    }
  }

  return {
    profile, days, selectedDate, setSelectedDate, profileOpen, setProfileOpen,
    mealOpen, setMealOpen, loaded, profileConfigured, greeting, activityChoice,
    setActivityChoice, mealDescription, setMealDescription, mealDraft, setMealDraft,
    analyzingMeal, mealError, bmr, maintenance, target, meals, totals, remaining,
    progress, macroTargets, weekDays, shiftDate, nextWeekLocked, saveProfile,
    addMeal, removeMeal, analyzeMeal,
  };
}
