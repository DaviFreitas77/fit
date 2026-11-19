"use client";

import { formatDate, type Meal } from "@/lib/nutrition";

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

function MacroIcon({ type }: { type: "protein" | "carbs" | "fat" }) {
  const labels = { protein: "P", carbs: "C", fat: "G" };
  return <span className={`macro-icon ${type}`}>{labels[type]}</span>;
}

export function Dashboard(props: Props) {
  const {
    profileName, greeting, selectedDateObject, weekDays, selectedDate,
    nextWeekLocked, onShiftWeek, onSelectDate, onOpenProfile, remaining,
    target, totals, progress, maintenance, bmr, macroTargets, meals,
    onOpenMeal, onRemoveMeal,
  } = props;

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="identity">
          <div className="identity-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="M7 20V9m5 11V4m5 16v-7M3 20h18" /></svg>
          </div>
          <span>Nutrição diária</span>
        </div>
        <nav className="desktop-nav" aria-label="Navegação">
          <button className="nav-item active" type="button"><span aria-hidden="true">●</span> Hoje</button>
          <button className="nav-item" type="button" onClick={onOpenProfile}><span aria-hidden="true">◷</span> Meu perfil</button>
        </nav>
        <div className="sidebar-summary">
          <span>Meta atual</span>
          <strong>{target.toLocaleString("pt-BR")} kcal</strong>
        </div>
      </aside>

      <section className="content">
        <header className="page-header">
          <div>
            <p className="eyebrow">{greeting}{profileName ? `, ${profileName}` : ""}</p>
            <h1>{formatDate(selectedDateObject)}</h1>
          </div>
          <button className="profile-button" type="button" onClick={onOpenProfile}>Ajustar perfil</button>
        </header>

        <div className="week-navigation">
          <button type="button" className="week-arrow" onClick={() => onShiftWeek(-7)} aria-label="Semana anterior">←</button>
          <div className="week-days" aria-label="Dias da semana">
            {weekDays.map((day) => (
              <button
                type="button"
                key={day.key}
                className="week-day"
                data-selected={selectedDate === day.key}
                data-future={day.future}
                disabled={day.future}
                onClick={() => onSelectDate(day.key)}
                aria-label={day.future ? `${day.short}, dia ${day.number}. Data futura indisponível` : `Selecionar ${day.short}, dia ${day.number}`}
                aria-pressed={selectedDate === day.key}
              >
                <span>{day.short}</span>
                <strong>{day.number}</strong>
              </button>
            ))}
          </div>
          <button type="button" className="week-arrow" onClick={() => onShiftWeek(7)} aria-label="Próxima semana" disabled={nextWeekLocked}>→</button>
        </div>

        <div className="dashboard-grid">
          <section className="calorie-card">
            <div className="calorie-copy">
              <p>Calorias restantes</p>
              <strong>{remaining.toLocaleString("pt-BR")}</strong>
              <span>de {target.toLocaleString("pt-BR")} kcal</span>
            </div>
            <div className="progress-ring" style={{ "--progress": `${progress * 3.6}deg` } as React.CSSProperties}>
              <div><strong>{totals.calories}</strong><span>consumidas</span></div>
            </div>
          </section>

          <section className="goal-card">
            <div><p>Gasto estimado</p><strong>{Math.round(maintenance).toLocaleString("pt-BR")} kcal</strong></div>
            <div className="goal-divider" />
            <div><p>Taxa basal</p><strong>{Math.round(bmr).toLocaleString("pt-BR")} kcal</strong></div>
          </section>

          <section className="macros-card">
            <div className="section-heading">
              <h2>Macronutrientes</h2>
              <span>{meals.length} {meals.length === 1 ? "registro" : "registros"}</span>
            </div>
            {[
              { key: "protein" as const, label: "Proteína", total: totals.protein, target: macroTargets.protein, unit: "g" },
              { key: "carbs" as const, label: "Carboidratos", total: totals.carbs, target: macroTargets.carbs, unit: "g" },
              { key: "fat" as const, label: "Gorduras", total: totals.fat, target: macroTargets.fat, unit: "g" },
            ].map((macro) => (
              <div className="macro-row" key={macro.key}>
                <MacroIcon type={macro.key} />
                <div className="macro-name"><span>{macro.label}</span><small>{macro.total}{macro.unit} / {macro.target}{macro.unit}</small></div>
                <div className="macro-bar"><div className={macro.key} style={{ width: `${Math.min((macro.total / macro.target) * 100, 100)}%` }} /></div>
              </div>
            ))}
          </section>
        </div>

        <section className="meals-section">
          <div className="section-heading">
            <h2>Alimentos registrados</h2>
            <button type="button" className="text-button" onClick={onOpenMeal}>+ Adicionar</button>
          </div>
          {meals.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon" aria-hidden="true">＋</div>
              <h3>Nenhum alimento registrado</h3>
              <p>Adicione o primeiro item consumido hoje.</p>
              <button type="button" onClick={onOpenMeal}>Registrar alimento</button>
            </div>
          ) : (
            <div className="meal-list">
              {meals.map((meal) => (
                <article className="meal-row" key={meal.id}>
                  <div className="meal-index" aria-hidden="true">{meal.name.charAt(0).toUpperCase()}</div>
                  <div className="meal-name">
                    <strong>{meal.name}</strong>
                    <span>{meal.category ?? "Refeição"} · {meal.time}</span>
                  </div>
                  <div className="meal-macros"><span>P {meal.protein}g</span><span>C {meal.carbs}g</span><span>G {meal.fat}g</span></div>
                  <strong className="meal-calories">{meal.calories} kcal</strong>
                  <button type="button" className="remove-button" onClick={() => onRemoveMeal(meal.id)} aria-label={`Remover ${meal.name}`}>×</button>
                </article>
              ))}
            </div>
          )}
        </section>
      </section>

      <button className="mobile-add" type="button" onClick={onOpenMeal} aria-label="Adicionar alimento">＋</button>
    </main>
  );
}
