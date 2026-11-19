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
      <div className="form-grid">
        <label className="span-two">
          Como você gosta de ser chamado?
          <input name="name" type="text" required autoComplete="given-name" defaultValue={profile.name} placeholder="Seu nome" />
        </label>
        <label>
          Sexo
          <select name="sex" defaultValue={profile.sex}>
            <option value="female">Feminino</option>
            <option value="male">Masculino</option>
          </select>
        </label>
        <label>
          Idade
          <input name="age" type="number" min="15" max="100" required defaultValue={profile.age} />
        </label>
        <label>
          Peso (kg)
          <input name="weight" type="number" min="30" max="300" step="0.1" required defaultValue={profile.weight} />
        </label>
        <label>
          Altura (cm)
          <input name="height" type="number" min="100" max="230" required defaultValue={profile.height} />
        </label>
        <label className="span-two">
          Nível de atividade
          <div className="activity-select">
            <select name="activity" value={activityChoice} onChange={(event) => onActivityChange(Number(event.target.value))}>
              {activityLevels.map((level) => (
                <option value={level.value} key={level.value}>{level.label}</option>
              ))}
            </select>
          </div>
          <p className="activity-description">
            {activityLevels.find((level) => level.value === activityChoice)?.description}
          </p>
        </label>
        <label className="span-two">
          Tipo de objetivo
          <select name="goalType" defaultValue={profile.goal > 0 ? "surplus" : "deficit"}>
            <option value="deficit">Déficit calórico</option>
            <option value="surplus">Superávit calórico</option>
          </select>
        </label>
      </div>
      <button className="primary-button" type="submit">{submitLabel}</button>
    </form>
  );
}
