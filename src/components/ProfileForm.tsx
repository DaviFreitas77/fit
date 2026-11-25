"use client";

import { FormEvent } from "react";
import { activityLevels, type Profile } from "@/lib/nutrition";
import { useUser } from "@/hooks/userHook";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/Spinner";
type Props = {
  profile: Profile;
  activityChoice: number;
  onActivityChange: (value: number) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  logOut? : () => void; 
  loggingOut?: boolean;
  saving?: boolean;
  
  submitLabel: string;
};

export function ProfileForm({
  profile,
  activityChoice,
  onActivityChange,
  onSubmit,
  logOut,
  loggingOut = false,
  saving = false,
  submitLabel,
}: Props) {
  const router = useRouter();
  const { user, isPending, isAuthenticated } = useUser();

  return (
    <form onSubmit={onSubmit}>
      <div className="grid grid-cols-2 gap-3">
        <label className="col-span-2 grid gap-[7px] text-[11px] font-extrabold text-muted">
          Como você gosta de ser chamado?
          <input
            className="h-[46px] w-full rounded-[10px] border border-border bg-field px-3 text-[13px] text-primary outline-none focus:border-brand focus:ring-[3px] focus:ring-brand/10"
            name="name"
            type="text"
            required
            autoComplete="given-name"
            defaultValue={profile.name}
            placeholder="Seu nome"
          />
        </label>
        <label className="grid gap-[7px] text-[11px] font-extrabold text-muted">
          Sexo
          <select
            className="h-[46px] w-full rounded-[10px] border border-border bg-field px-3 text-[13px] text-primary outline-none focus:border-brand focus:ring-[3px] focus:ring-brand/10"
            name="sex"
            defaultValue={profile.sex}
          >
            <option value="female">Feminino</option>
            <option value="male">Masculino</option>
          </select>
        </label>
        <label className="grid gap-[7px] text-[11px] font-extrabold text-muted">
          Idade
          <input
            className="h-[46px] w-full rounded-[10px] border border-border bg-field px-3 text-[13px] text-primary outline-none focus:border-brand focus:ring-[3px] focus:ring-brand/10"
            name="age"
            type="number"
            min="15"
            max="100"
            required
            defaultValue={profile.age}
          />
        </label>
        <label className="grid gap-[7px] text-[11px] font-extrabold text-muted">
          Peso (kg)
          <input
            className="h-[46px] w-full rounded-[10px] border border-border bg-field px-3 text-[13px] text-primary outline-none focus:border-brand focus:ring-[3px] focus:ring-brand/10"
            name="weight"
            type="number"
            min="30"
            max="300"
            step="0.1"
            required
            defaultValue={profile.weight}
          />
        </label>
        <label className="grid gap-[7px] text-[11px] font-extrabold text-muted">
          Altura (cm)
          <input
            className="h-[46px] w-full rounded-[10px] border border-border bg-field px-3 text-[13px] text-primary outline-none focus:border-brand focus:ring-[3px] focus:ring-brand/10"
            name="height"
            type="number"
            min="100"
            max="230"
            required
            defaultValue={profile.height}
          />
        </label>
        <label className="col-span-2 grid gap-[7px] text-[11px] font-extrabold text-muted">
          Nível de atividade
          <div className="relative">
            <select
              className="h-[52px] w-full rounded-xl border border-border bg-field px-3 text-[13px] font-extrabold text-primary outline-none"
              name="activity"
              value={activityChoice}
              onChange={(event) => onActivityChange(Number(event.target.value))}
            >
              {activityLevels.map((level) => (
                <option value={level.value} key={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
          </div>
          <p className="border-l-2 border-brand px-0 py-0.5 pl-2.5 text-[11px] font-semibold leading-[1.45] text-muted">
            {
              activityLevels.find((level) => level.value === activityChoice)
                ?.description
            }
          </p>
        </label>
        <label className="col-span-2 grid gap-[7px] text-[11px] font-extrabold text-muted">
          Tipo de objetivo
          <select
            className="h-[46px] w-full rounded-[10px] border border-border bg-field px-3 text-[13px] text-primary outline-none focus:border-brand focus:ring-[3px] focus:ring-brand/10"
            name="goalType"
            defaultValue={profile.goal > 0 ? "surplus" : "deficit"}
          >
            <option value="deficit">Déficit calórico</option>
            <option value="surplus">Superávit calórico</option>
          </select>
        </label>
      </div>
      <button
        disabled={saving}
        className="mt-[18px] flex min-h-11 w-full items-center justify-center gap-2 rounded-[10px] bg-primary px-4 text-xs font-extrabold text-primary-foreground disabled:cursor-wait disabled:opacity-70 md:mt-[22px]"
        type="submit"
      >
        {saving && <Spinner />}
        {saving ? "Salvando..." : submitLabel}
      </button>
      <button
        onClick={
          isAuthenticated
            ? logOut
            : () => {
                router.push("/auth");
              }
        }
        disabled={loggingOut}
        className={`mt-[18px] flex min-h-11 w-full items-center justify-center gap-2 rounded-[10px] ${isAuthenticated ? "bg-red-400" : "bg-green-700"} px-4 text-xs font-extrabold text-primary-foreground md:mt-[22px] disabled:cursor-wait disabled:opacity-70`}
        type="button"
      >
        {loggingOut && <Spinner />}
        {loggingOut ? "Saindo..." : isAuthenticated ? "Sair" : "Criar conta ou entrar"}
      </button>
    </form>
  );
}
