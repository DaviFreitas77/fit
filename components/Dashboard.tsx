"use client";

import { useEffect, useRef, useState } from "react";
import { formatDate, type Meal } from "@/lib/nutrition";
import { themeColors } from "@/lib/theme";
import { BsArrowLeftShort, BsArrowRightShort } from "react-icons/bs";
import { FaRegUser } from "react-icons/fa";

type WeekDay = { key: string; future: boolean; short: string; number: number };

type Props = {
  profileName: string;
  greeting: string;
  selectedDateObject: Date;
  weekDays: WeekDay[];
  selectedDate: string;
  nextWeekLocked: boolean;
  onShiftWeek: (offset: number) => void;
  onSelectDate: (key: string) => void;
  onOpenProfile: () => void;
  remaining: number;
  target: number;
  totals: { calories: number; protein: number; carbs: number; fat: number };
  progress: number;
  maintenance: number;
  bmr: number;
  macroTargets: { protein: number; carbs: number; fat: number };
  meals: Meal[];
  onOpenMeal: () => void;
  onRemoveMeal: (id: string) => void;
};

export function Dashboard(props: Props) {
  const [bmrInfoOpen, setBmrInfoOpen] = useState(false);
  const [maintenanceInfoOpen, setMaintenanceInfoOpen] = useState(false);
  const bmrInfoRef = useRef<HTMLDivElement>(null);
  const maintenanceInfoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!bmrInfoOpen && !maintenanceInfoOpen) return;

    function closeOnOutsideClick(event: MouseEvent) {
      if (!bmrInfoRef.current?.contains(event.target as Node)) {
        setBmrInfoOpen(false);
      }
      if (!maintenanceInfoRef.current?.contains(event.target as Node)) {
        setMaintenanceInfoOpen(false);
      }
    }

    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, [bmrInfoOpen, maintenanceInfoOpen]);

  const {
    profileName,
    greeting,
    selectedDateObject,
    weekDays,
    selectedDate,
    nextWeekLocked,
    onShiftWeek,
    onSelectDate,
    onOpenProfile,
    remaining,
    target,
    totals,
    progress,
    maintenance,
    bmr,
    macroTargets,
    meals,
    onOpenMeal,
    onRemoveMeal,
  } = props;

  const ring = {
    background: `conic-gradient(${themeColors.brand} ${progress * 3.6}deg, ${themeColors.line} 0deg)`,
  };

  return (
    <main className="min-h-screen md:grid md:grid-cols-[220px_minmax(0,1fr)] xl:grid-cols-[250px_minmax(0,1fr)]">
      <aside className="sticky top-0 hidden h-screen flex-col border-r border-line bg-card px-[18px] py-7 md:flex">
        <div className="flex items-center gap-2.5 text-sm font-black">
          <div
            className="grid size-[38px] place-items-center rounded-[11px] bg-ink"
            aria-hidden="true"
          >
            <svg
              className="w-5 fill-none stroke-white"
              viewBox="0 0 24 24"
              strokeWidth="1.8"
            >
              <path d="M7 20V9m5 11V4m5 16v-7M3 20h18" />
            </svg>
          </div>
          <span>Nutrição diária</span>
        </div>
        <nav className="mt-[42px] grid gap-[5px]" aria-label="Navegação">
          <button
            className="flex h-11 items-center gap-2.5 rounded-[10px] bg-brand-soft px-3 text-left text-[13px] font-extrabold text-brand-dark"
            type="button"
          >
            <span>●</span> Hoje
          </button>
          <button
            className="flex h-11 items-center gap-2.5 rounded-[10px] text-left px-3 text-[13px] font-extrabold text-muted"
            type="button"
            onClick={onOpenProfile}
          >
            <span>◷</span> Meu perfil
          </button>
        </nav>
        <div className="mt-auto grid gap-[5px] rounded-[14px] bg-ink p-4 text-white">
          <span className="text-[10px] text-muted">Meta atual</span>
          <strong className="text-[19px]">
            {target.toLocaleString("pt-BR")} kcal
          </strong>
        </div>
      </aside>

      <section className="min-h-screen px-4 pb-24 pt-6 md:max-w-[1180px] md:px-10 md:pb-12 md:pt-9 xl:px-14">
        <header className="flex items-start justify-between gap-3">
          <div>
            <h1 className="mb-[5px] text-xs font-black capitalize  text-brand">
              {formatDate(selectedDateObject)}
            </h1>
            <p className="m-0 text-xl font-black tracking-[-0.04em] capitalize">
              {greeting}
              {profileName ? `, ${profileName}` : ""}
            </p>
          </div>
          <button
            className="min-h-10 shrink-0 rounded-xl border border-line bg-paper px-3 text-xs font-extrabold text-ink"
            type="button"
            onClick={onOpenProfile}
          >
            <FaRegUser size={16} />
          </button>
        </header>

        <div className="my-[18px] grid grid-cols-[32px_minmax(0,1fr)_32px] items-center gap-[6px]">
          <button
            type="button"
            className="size-8 h-14 flex items-center justify-center rounded-[10px] border border-line bg-paper text-sm font-extrabold disabled:cursor-not-allowed disabled:opacity-40"
            onClick={() => onShiftWeek(-7)}
            aria-label="Semana anterior"
          >
            <BsArrowLeftShort size={20} />
          </button>
          <div
            className="grid grid-cols-7 gap-[3px]"
            aria-label="Dias da semana"
          >
            {weekDays.map((day) => (
              <button
                type="button"
                key={day.key}
                className={`grid min-w-[34px] h-14 place-items-center content-center gap-1  border text-muted ${selectedDate === day.key ? "border-none text-brand-dark" : "border-transparent"} disabled:cursor-not-allowed disabled:opacity-40`}
                disabled={day.future}
                onClick={() => onSelectDate(day.key)}
                aria-label={
                  day.future
                    ? `${day.short}, dia ${day.number}. Data futura indisponível`
                    : `Selecionar ${day.short}, dia ${day.number}`
                }
                aria-pressed={selectedDate === day.key}
              >
                <span className="text-[9px] font-extrabold capitalize">
                  {day.short}
                </span>
                <strong
                  className={`grid size-7 place-items-center rounded-sm text-xs ${selectedDate === day.key ? "bg-brand-dark text-white" : "text-ink "}`}
                >
                  {day.number}
                </strong>
              </button>
            ))}
          </div>
          <button
            type="button"
            className="size-8 flex items-center justify-center h-14 rounded-[10px] border border-line bg-paper text-sm font-extrabold disabled:cursor-not-allowed disabled:opacity-40"
            onClick={() => onShiftWeek(7)}
            aria-label="Próxima semana"
            disabled={nextWeekLocked}
          >
            <BsArrowRightShort size={20} />
          </button>
        </div>

        <div className="grid gap-3 md:grid-cols-[minmax(280px,1.3fr)_minmax(220px,.7fr)] xl:grid-cols-[1.25fr_.75fr]">
          <section className="overflow-hidden rounded-2xl border border-line bg-gradient-to-br from-card to-brand-soft/40 p-6 px-5">
            <div className="flex min-h-[118px] items-center justify-between gap-4">
              <div>
                <p className="mb-2 text-xs font-bold text-muted">
                  Calorias restantes
                </p>
                <strong className="block text-[clamp(38px,12vw,58px)] leading-[0.95] tracking-[-0.07em]">
                  {remaining.toLocaleString("pt-BR")}
                </strong>
                <span className="mt-2.5 block text-xs text-muted">
                  de {target.toLocaleString("pt-BR")} kcal
                </span>
              </div>
              <div
                className="grid size-[118px] shrink-0 place-items-center rounded-full"
                style={ring}
              >
                <div className="grid size-[92px] place-content-center rounded-full bg-card text-center">
                  <strong className="text-xl">{totals.calories}</strong>
                  <span className="text-[9px] text-muted">consumidas</span>
                </div>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3 border-t border-line pt-4">
              {[
                { label: "Proteína", total: totals.protein, target: macroTargets.protein, color: "bg-brand" },
                { label: "Carbos", total: totals.carbs, target: macroTargets.carbs, color: "bg-carbs" },
                { label: "Gorduras", total: totals.fat, target: macroTargets.fat, color: "bg-fat" },
              ].map((macro) => (
                <div className="min-w-0" key={macro.label}>
                  <div className="mb-2 h-1 rounded-full bg-line">
                    <div className={`h-full rounded-full ${macro.color}`} style={{ width: `${Math.min((macro.total / macro.target) * 100, 100)}%` }} />
                  </div>
                  <span className="block truncate text-[10px] font-extrabold text-muted">{macro.label}</span>
                  <strong className="mt-0.5 block text-xs">
                    {macro.total}g<span className="font-normal text-muted">/{macro.target}g</span>
                  </strong>
                </div>
              ))}
            </div>
          </section>

          <section className="grid min-h-[92px] grid-cols-[1fr_1px_1fr] items-center rounded-2xl border border-border bg-card px-[18px] py-[14px] xl:grid-cols-1 xl:grid-rows-[1fr_1fr]">
            <div ref={maintenanceInfoRef} className="relative">
              <div className="mb-[5px] flex items-center gap-1.5">
                <p className="text-[11px] text-muted">Gasto estimado</p>
                <button
                  type="button"
                  className="grid size-[18px] place-items-center rounded-full border border-border bg-card text-[10px] font-black text-muted transition-colors hover:border-brand hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30"
                  onClick={() => setMaintenanceInfoOpen((open) => !open)}
                  aria-label="O que é gasto estimado"
                  aria-expanded={maintenanceInfoOpen}
                >
                  !
                </button>
              </div>
              <strong className="text-base">
                {Math.round(maintenance).toLocaleString("pt-BR")} kcal
              </strong>
              {maintenanceInfoOpen && (
                <div
                  role="tooltip"
                  className="absolute bottom-full left-0 z-30 mb-2 w-[220px] rounded-xl border border-border bg-card p-3 text-[11px] leading-[1.55] text-muted shadow-xl"
                >
                  <strong className="mb-1 block text-xs text-primary">Gasto energético diário</strong>
                  Estimativa das calorias que você gasta por dia considerando sua taxa basal e seu nível de atividade.
                </div>
              )}
            </div>
            <div className="h-11 w-px bg-line xl:hidden" />
            <div ref={bmrInfoRef} className="relative pl-4 xl:border-t xl:border-line xl:pl-0 xl:pt-3">
              <div className="mb-[5px] flex items-center gap-1.5">
                <p className="text-[11px] text-muted">Taxa basal</p>
                <button
                  type="button"
                  className="grid size-[18px] place-items-center rounded-full border border-border bg-card text-[10px] font-black text-muted transition-colors hover:border-brand hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30"
                  onClick={() => setBmrInfoOpen((open) => !open)}
                  aria-label="O que é taxa basal"
                  aria-expanded={bmrInfoOpen}
                >
                  !
                </button>
              </div>
              <strong className="text-base">
                {Math.round(bmr).toLocaleString("pt-BR")} kcal
              </strong>
              {bmrInfoOpen && (
                <div
                  role="tooltip"
                  className="absolute bottom-full right-0 z-30 mb-2 w-[220px] rounded-xl border border-border bg-card p-3 text-[11px] leading-[1.55] text-muted shadow-xl xl:left-0 xl:right-auto"
                >
                  <strong className="mb-1 block text-xs text-primary">Taxa metabólica basal</strong>
                  Quantidade estimada de calorias que seu corpo usa em repouso para manter funções essenciais, como respirar e manter a temperatura.
                </div>
              )}
            </div>
          </section>

        </div>

        <section className="mt-[22px]">
          <div className="flex items-center justify-between">
            <h2 className="m-0 text-base font-black">Alimentos registrados</h2>
            <button
              type="button"
              className="border-0 bg-transparent text-xs font-extrabold text-brand-dark"
              onClick={onOpenMeal}
            >
              + Adicionar
            </button>
          </div>
          {meals.length === 0 ? (
            <div className="mt-3 grid min-h-[210px] place-items-center content-center rounded-2xl border border-border bg-card text-center">
              <div className="grid size-[42px] place-items-center rounded-full bg-brand-soft text-2xl text-brand-dark">
                ＋
              </div>
              <h3 className="mb-1 mt-3 text-sm">Nenhum alimento registrado</h3>
              <p className="mb-[14px] mt-0 text-xs text-muted">
                Adicione o primeiro item consumido hoje.
              </p>
              <button
                type="button"
                className="min-h-11 rounded-[10px] bg-ink px-4 text-xs font-extrabold text-white"
                onClick={onOpenMeal}
              >
                Registrar alimento
              </button>
            </div>
          ) : (
            <div className="mt-3 grid gap-2">
              {meals.map((meal) => (
                <article
                  className="grid min-h-[76px] grid-cols-[44px_1fr_auto] items-center gap-2.5 rounded-2xl border border-line bg-paper p-2.5 md:grid-cols-[44px_1fr_250px_110px_34px]"
                  key={meal.id}
                >
                  <div className="grid size-11 place-items-center rounded-xl bg-brand-soft font-black text-brand-foreground">
                    {meal.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <strong className="block truncate text-xs">
                      {meal.name}
                    </strong>
                    <span className="mt-1 block text-[10px] text-muted">
                      {meal.category ?? "Refeição"} · {meal.time}
                    </span>
                  </div>
                  <div className="hidden gap-[14px] text-[11px] text-muted md:flex">
                    <span>P {meal.protein}g</span>
                    <span>C {meal.carbs}g</span>
                    <span>G {meal.fat}g</span>
                  </div>
                  <strong className="col-start-3 text-xs md:col-start-auto">
                    {meal.calories} kcal
                  </strong>
                  <button
                    type="button"
                    className="hidden size-[30px] place-items-center rounded-full bg-line text-[18px] text-muted md:grid"
                    onClick={() => onRemoveMeal(meal.id)}
                    aria-label={`Remover ${meal.name}`}
                  >
                    ×
                  </button>
                </article>
              ))}
            </div>
          )}
        </section>
      </section>

      <button
        className="fixed bottom-[18px] right-[18px] z-20 grid size-14 place-items-center rounded-full bg-primary text-[28px] leading-none text-primary-foreground shadow-xl md:hidden"
        type="button"
        onClick={onOpenMeal}
        aria-label="Adicionar alimento"
      >
        ＋
      </button>
    </main>
  );
}
