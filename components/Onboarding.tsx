"use client";

import { FormEvent } from "react";
import { type Profile } from "@/lib/nutrition";
import { ProfileForm } from "./ProfileForm";

type Props = {
  profile: Profile;
  activityChoice: number;
  onActivityChange: (value: number) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export function Onboarding({ profile, activityChoice, onActivityChange, onSubmit }: Props) {
  return (
    <main className="onboarding-shell">
      <section className="onboarding-card">
        <div className="onboarding-heading">
          <div className="onboarding-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="M7 20V9m5 11V4m5 16v-7M3 20h18" /></svg>
          </div>
          <p>Vamos preparar sua meta diária</p>
          <h1>Comece pelo seu perfil</h1>
          <span>Essas informações serão usadas para calcular seu metabolismo basal e a meta de calorias.</span>
        </div>
        <ProfileForm
          profile={profile}
          activityChoice={activityChoice}
          onActivityChange={onActivityChange}
          onSubmit={onSubmit}
          submitLabel="Salvar e continuar"
        />
      </section>
    </main>
  );
}
