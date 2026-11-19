"use client";

import { FormEvent } from "react";
import { activityLevels, type Profile } from "@/lib/nutrition";

type Props = {
  profile: Profile;
  activityChoice: number;
  onActivityChange: (value: number) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  submitLabel: string;
};

export function ProfileForm({
  profile,
  activityChoice,
  onActivityChange,
  onSubmit,
  submitLabel,
}: Props) {
  return (
    <form onSubmit={onSubmit}>
      <div className="grid grid-cols-2 gap-3">
        <label className="col-span-2 grid gap-[7px] text-[11px] font-extrabold text-[#718078]">
          Como você gosta de ser chamado?
          <input className="h-[46px] w-full rounded-[10px] border border-[#dde5df] bg-[#fafbfa] px-3 text-[13px] text-[#1a241f] outline-none focus:border-[#4f8f72] focus:ring-[3px] focus:ring-[#4f8f72]/10" name="name" type="text" required autoComplete="given-name" defaultValue={profile.name} placeholder="Seu nome" />
        </label>
        <label className="grid gap-[7px] text-[11px] font-extrabold text-[#718078]">
          Sexo
          <select className="h-[46px] w-full rounded-[10px] border border-[#dde5df] bg-[#fafbfa] px-3 text-[13px] text-[#1a241f] outline-none focus:border-[#4f8f72] focus:ring-[3px] focus:ring-[#4f8f72]/10" name="sex" defaultValue={profile.sex}>
            <option value="female">Feminino</option>
            <option value="male">Masculino</option>
          </select>
        </label>
        <label className="grid gap-[7px] text-[11px] font-extrabold text-[#718078]">
          Idade
          <input className="h-[46px] w-full rounded-[10px] border border-[#dde5df] bg-[#fafbfa] px-3 text-[13px] text-[#1a241f] outline-none focus:border-[#4f8f72] focus:ring-[3px] focus:ring-[#4f8f72]/10" name="age" type="number" min="15" max="100" required defaultValue={profile.age} />
        </label>
        <label className="grid gap-[7px] text-[11px] font-extrabold text-[#718078]">
          Peso (kg)
          <input className="h-[46px] w-full rounded-[10px] border border-[#dde5df] bg-[#fafbfa] px-3 text-[13px] text-[#1a241f] outline-none focus:border-[#4f8f72] focus:ring-[3px] focus:ring-[#4f8f72]/10" name="weight" type="number" min="30" max="300" step="0.1" required defaultValue={profile.weight} />
        </label>
        <label className="grid gap-[7px] text-[11px] font-extrabold text-[#718078]">
          Altura (cm)
          <input className="h-[46px] w-full rounded-[10px] border border-[#dde5df] bg-[#fafbfa] px-3 text-[13px] text-[#1a241f] outline-none focus:border-[#4f8f72] focus:ring-[3px] focus:ring-[#4f8f72]/10" name="height" type="number" min="100" max="230" required defaultValue={profile.height} />
        </label>
        <label className="col-span-2 grid gap-[7px] text-[11px] font-extrabold text-[#718078]">
          Nível de atividade
          <div className="relative">
            <select className="h-[52px] w-full rounded-xl border border-[#dde5df] bg-gradient-to-br from-[#fafcfa] to-[#f1f6f3] px-3 text-[13px] font-extrabold text-[#1a241f] outline-none" name="activity" value={activityChoice} onChange={(event) => onActivityChange(Number(event.target.value))}>
              {activityLevels.map((level) => (
                <option value={level.value} key={level.value}>{level.label}</option>
              ))}
            </select>
          </div>
          <p className="border-l-2 border-[#4f8f72] px-0 py-0.5 pl-2.5 text-[11px] font-semibold leading-[1.45] text-[#718078]">
            {activityLevels.find((level) => level.value === activityChoice)?.description}
          </p>
        </label>
        <label className="col-span-2 grid gap-[7px] text-[11px] font-extrabold text-[#718078]">
          Tipo de objetivo
          <select className="h-[46px] w-full rounded-[10px] border border-[#dde5df] bg-[#fafbfa] px-3 text-[13px] text-[#1a241f] outline-none focus:border-[#4f8f72] focus:ring-[3px] focus:ring-[#4f8f72]/10" name="goalType" defaultValue={profile.goal > 0 ? "surplus" : "deficit"}>
            <option value="deficit">Déficit calórico</option>
            <option value="surplus">Superávit calórico</option>
          </select>
        </label>
      </div>
      <button className="mt-[18px] min-h-11 w-full rounded-[10px] bg-[#1a241f] px-4 text-xs font-extrabold text-white md:mt-[22px]" type="submit">{submitLabel}</button>
    </form>
  );
}
