"use client";

import { FormEvent } from "react";
import { type MealDraft } from "@/lib/nutrition";

type Props = {
  open: boolean;
  description: string;
  draft: MealDraft;
  analyzing: boolean;
  error: string;
  onDescriptionChange: (value: string) => void;
  onDraftChange: (draft: MealDraft) => void;
  onAnalyze: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
};

export function MealModal({ open, description, draft, analyzing, error, onDescriptionChange, onDraftChange, onAnalyze, onSubmit, onClose }: Props) {
  if (!open) return null;
  const update = (field: keyof MealDraft, value: string) => onDraftChange({ ...draft, [field]: value });
  const inputClass = "h-12 w-full rounded-[11px] border border-border bg-surface px-3 text-[13px] text-primary outline-none focus:border-brand focus:ring-[3px] focus:ring-brand/10";

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-overlay/40 backdrop-blur-sm md:items-center" role="presentation" onMouseDown={onClose}>
      <form className="max-h-[92vh] w-full max-w-[560px] overflow-y-auto rounded-t-[22px] bg-card px-4 pb-6 pt-5 shadow-2xl md:rounded-[18px] md:p-6" onSubmit={onSubmit} onMouseDown={(event) => event.stopPropagation()}>
        <div className="mb-[14px] flex items-start justify-between">
          <div>
            <p className="mb-[5px] text-[11px] font-black uppercase tracking-[0.12em] text-brand">Novo registro</p>
            <h2 className="m-0 text-xl font-black">Adicionar alimento</h2>
          </div>
          <button type="button" className="grid size-[34px] place-items-center rounded-full border border-border bg-card text-xl text-muted" onClick={onClose} aria-label="Fechar">×</button>
        </div>

        <div className="grid gap-2.5 rounded-2xl border border-border bg-brand-soft/30 p-[14px]">
          <div className="flex items-center justify-between">
            <div className="grid gap-0.5">
              <strong className="text-xs text-primary">Descrever refeição</strong>
              <span className="text-[10px] text-muted">IA pode preencher os dados</span>
            </div>
            <span className="animate-pulse bg-gradient-to-r from-brand via-fat to-carbs bg-clip-text text-[11px] font-black tracking-[0.04em] text-transparent">IA</span>
          </div>
          <textarea
            className="h-[82px] min-h-[82px] w-full resize-y border-0 border-b border-border bg-transparent px-0 py-3 text-[13px] leading-[1.45] text-primary outline-none placeholder:text-muted focus:border-border focus:ring-0"
            value={description}
            onChange={(event) => onDescriptionChange(event.target.value)}
            placeholder="Ex.: 4 colheres de sopa de arroz e 2 ovos fritos"
            rows={3}
          />
          {error && <p className="text-[11px] font-extrabold text-error" role="alert">{error}</p>}
          <button type="button" className="min-h-11 w-full rounded-xl bg-brand-dark text-xs font-extrabold text-white disabled:cursor-wait disabled:opacity-65" onClick={onAnalyze} disabled={analyzing}>
            {analyzing ? "Analisando..." : "Preencher com IA"}
          </button>
        </div>

        <div className="mb-2 mt-[18px] flex items-center justify-between px-0.5">
          <strong className="text-xs">Detalhes da refeição</strong>
          <span className="text-[10px] text-muted">Você pode ajustar</span>
        </div>
        <div className="grid grid-cols-1 gap-[9px] rounded-[14px] border border-border bg-card p-3">
          <label className="grid gap-[6px] text-[10px] font-extrabold text-muted">
            Refeição
            <select className={inputClass} name="category" defaultValue="Almoço">
              <option value="Café da manhã">Café da manhã</option>
              <option value="Almoço">Almoço</option>
              <option value="Café da tarde">Café da tarde</option>
              <option value="Janta">Janta</option>
              <option value="Ceia">Ceia</option>
            </select>
          </label>
          <label className="grid gap-[6px] text-[10px] font-extrabold text-muted">
            Nome
            <input className={inputClass} name="name" type="text" required value={draft.name} onChange={(event) => update("name", event.target.value)} placeholder="Ex.: arroz, frango e salada" />
          </label>
          <label className="grid gap-[6px] text-[10px] font-extrabold text-muted">
            Calorias
            <input className={inputClass} name="calories" type="number" min="0" required value={draft.calories} onChange={(event) => update("calories", event.target.value)} placeholder="kcal" />
          </label>
          <label className="grid gap-[6px] text-[10px] font-extrabold text-muted">
            Proteínas
            <input className={inputClass} name="protein" type="number" min="0" step="0.1" value={draft.protein} onChange={(event) => update("protein", event.target.value)} placeholder="g" />
          </label>
          <label className="grid gap-[6px] text-[10px] font-extrabold text-muted">
            Carboidratos
            <input className={inputClass} name="carbs" type="number" min="0" step="0.1" value={draft.carbs} onChange={(event) => update("carbs", event.target.value)} placeholder="g" />
          </label>
          <label className="grid gap-[6px] text-[10px] font-extrabold text-muted">
            Gorduras
            <input className={inputClass} name="fat" type="number" min="0" step="0.1" value={draft.fat} onChange={(event) => update("fat", event.target.value)} placeholder="g" />
          </label>
        </div>
        <button className="mt-[14px] min-h-12 w-full rounded-xl bg-primary text-xs font-extrabold text-primary-foreground" type="submit">Registrar</button>
      </form>
    </div>
  );
}
