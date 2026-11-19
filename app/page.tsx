"use client";

import { Dashboard } from "@/components/Dashboard";
import { MealModal } from "@/components/MealModal";
import { Onboarding } from "@/components/Onboarding";
import { ProfileModal } from "@/components/ProfileModal";
import { useNutritionApp } from "@/hooks/useNutritionApp";

export default function Home() {
  const app = useNutritionApp();

  if (!app.loaded || !app.profileConfigured) {
    return (
      <Onboarding
        profile={app.profile}
        activityChoice={app.activityChoice}
        onActivityChange={app.setActivityChoice}
        onSubmit={app.saveProfile}
      />
    );
  }

  const selectedDateObject = app.selectedDate
    ? new Date(`${app.selectedDate}T12:00:00`)
    : new Date("2020-01-01T12:00:00");

  const openProfile = () => {
    app.setActivityChoice(app.profile.activity);
    app.setProfileOpen(true);
  };

  return (
    <>
      <Dashboard
        profileName={app.profile.name}
        greeting={app.greeting}
        selectedDateObject={selectedDateObject}
        weekDays={app.weekDays}
        selectedDate={app.selectedDate}
        nextWeekLocked={app.nextWeekLocked}
        onShiftWeek={app.shiftDate}
        onSelectDate={app.setSelectedDate}
        onOpenProfile={openProfile}
        remaining={app.remaining}
        target={app.target}
        totals={app.totals}
        progress={app.progress}
        maintenance={app.maintenance}
        bmr={app.bmr}
        macroTargets={app.macroTargets}
        meals={app.meals}
        onOpenMeal={() => app.setMealOpen(true)}
        onRemoveMeal={app.removeMeal}
      />
      <ProfileModal
        open={app.profileOpen}
        profile={app.profile}
        activityChoice={app.activityChoice}
        onActivityChange={app.setActivityChoice}
        onSubmit={app.saveProfile}
        onClose={() => app.setProfileOpen(false)}
      />
      <MealModal
        open={app.mealOpen}
        description={app.mealDescription}
        draft={app.mealDraft}
        analyzing={app.analyzingMeal}
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
