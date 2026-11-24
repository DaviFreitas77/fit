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
    <main className="grid min-h-screen place-items-center bg-canvas p-[18px] md:p-8">
      <section className="w-full max-w-[520px] rounded-[20px] border border-border bg-card p-[22px_16px] shadow-xl md:rounded-3xl md:p-8">
        <div className="mb-5">
          <div className="grid size-11 place-items-center rounded-[13px] bg-primary" aria-hidden="true">
            <svg className="w-[23px] fill-none stroke-white" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M7 20V9m5 11V4m5 16v-7M3 20h18" /></svg>
          </div>
          <p className="mb-[5px] mt-[14px] text-[11px] font-black uppercase tracking-[0.08em] text-brand">Vamos preparar sua meta diária</p>
          <h1 className="m-0 text-[clamp(25px,8vw,36px)] font-black tracking-[-0.05em]">Comece pelo seu perfil</h1>
          <span className="mt-2 block max-w-[430px] text-xs leading-[1.6] text-muted">Essas informações serão usadas para calcular seu metabolismo basal e a meta de calorias.</span>
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
