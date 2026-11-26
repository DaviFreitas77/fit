"use client";

import { Dashboard } from "@/components/Dashboard";
import { MealModal } from "@/components/MealModal";
import { Onboarding } from "@/components/Onboarding";
import { ProfileModal } from "@/components/ProfileModal";
import { useMeals } from "@/hooks/useMeals";
import { useNutritionApp } from "@/hooks/useNutritionApp";
import { syncUser, useUser } from "@/hooks/userHook";
import { dateFromStored, dateKey } from "@/lib/nutrition";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export default function Home() {
  const { user, isPending, isAuthenticated } = useUser();
  const queryClient = useQueryClient();
  const app = useNutritionApp();
  const { data: meals, isLoading: mealsLoading } = useMeals();
  const {
    allMeals,
    finishProfileSave,
    loaded,
    profile,
    profileConfigured,
  } = app;

  const visibleMeals = isPending
    ? []
    : isAuthenticated
      ? (meals ?? []).filter(
          (meal) =>
            dateKey(dateFromStored(meal.createdAt)) === app.selectedDate,
        )
      : app.meals;

  const visibleTotals = visibleMeals.reduce(
    (totals, meal) => ({
      calories: totals.calories + meal.calories,
      protein: totals.protein + meal.protein,
      carbs: totals.carbs + meal.carbs,
      fat: totals.fat + meal.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 },
  );


  useEffect(() => {
    if (
      isPending ||
      !isAuthenticated ||
      !loaded ||
      !profileConfigured
    ) {
      return;
    }

    const syncApp = async () => {
      try {
        const result = await syncUser(profile, allMeals);
        if (result && user?.id) {
          await queryClient.invalidateQueries({
            queryKey: ["meals", user.id],
            exact: true,
          });
        }
      } finally {
        finishProfileSave();
      }
    };

    syncApp();
  }, [
    isPending,
    isAuthenticated,
    loaded,
    profileConfigured,
    profile,
    allMeals,
    finishProfileSave,
    queryClient,
    user?.id,
  ]);

  if (!app.loaded || !app.profileConfigured) {
    return (
      <Onboarding
        profile={app.profile}
        activityChoice={app.activityChoice}
        onActivityChange={app.setActivityChoice}
        onSubmit={app.saveProfile}
        saving={app.profileSaving}
      />
    );
  }

  const selectedDateObject = app.selectedDate
    ? dateFromStored(app.selectedDate)
    : new Date("2020-01-01T12:00:00");

  const openProfile = () => {
    app.setActivityChoice(app.profile.activity);
    app.setProfileOpen(true);
  };

  return (
    <>
      <Dashboard
        profileName={app.profile.name || user?.name || "Usuário"}
        greeting={app.greeting}
        selectedDateObject={selectedDateObject}
        weekDays={app.weekDays}
        selectedDate={app.selectedDate}
        nextWeekLocked={app.nextWeekLocked}
        onShiftWeek={app.shiftDate}
        onSelectDate={app.setSelectedDate}
        onOpenProfile={openProfile}
        remaining={app.target - visibleTotals.calories}
        target={app.target}
        totals={visibleTotals}
        mealsLoading={isPending || (isAuthenticated && mealsLoading)}
        progress={
          app.target > 0
            ? Math.min((visibleTotals.calories / app.target) * 100, 100)
            : 0
        }
        maintenance={app.maintenance}
        bmr={app.bmr}
        macroTargets={app.macroTargets}
        meals={visibleMeals}
        onOpenMeal={() => app.setMealOpen(true)}
        onRemoveMeal={app.removeMeal}
      />
      <ProfileModal
        open={app.profileOpen}
        profile={app.profile}
        activityChoice={app.activityChoice}
        onActivityChange={app.setActivityChoice}
        onSubmit={app.saveProfile}
        saving={app.profileSaving}
        onClose={() => app.setProfileOpen(false)}
      />
      <MealModal
        open={app.mealOpen}
        description={app.mealDescription}
        draft={app.mealDraft}
        analyzing={app.analyzingMeal}
        saving={app.savingMeal}
        error={app.mealError}
        onDescriptionChange={app.setMealDescription}
        onDraftChange={app.setMealDraft}
        onAnalyze={app.analyzeMeal}
        onSubmit={app.addMeal}
        onClose={() => app.setMealOpen(false)}
      />
    </>
  );
}
