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
  const inputClass = "h-12 w-full rounded-[11px] border border-[#dde5df] bg-[#f8faf8] px-3 text-[13px] text-[#1a241f] outline-none focus:border-[#4f8f72] focus:ring-[3px] focus:ring-[#4f8f72]/10";

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#141c18]/40 backdrop-blur-sm md:items-center" role="presentation" onMouseDown={onClose}>
      <form className="max-h-[92vh] w-full max-w-[560px] overflow-y-auto rounded-t-[22px] bg-white px-4 pb-6 pt-5 shadow-[0_-16px_40px_rgba(24,35,29,.16)] md:rounded-[18px] md:p-6" onSubmit={onSubmit} onMouseDown={(event) => event.stopPropagation()}>
        <div className="mb-[14px] flex items-start justify-between">
          <div>
            <p className="mb-[5px] text-[11px] font-black uppercase tracking-[0.12em] text-[#4f8f72]">Novo registro</p>
            <h2 className="m-0 text-xl font-black">Adicionar alimento</h2>
          </div>
          <button type="button" className="grid size-[34px] place-items-center rounded-full border border-[#dde5df] bg-white text-xl text-[#718078]" onClick={onClose} aria-label="Fechar">×</button>
        </div>

        <div className="grid gap-2.5 rounded-2xl border border-[#dce5df] bg-[#f4f8f5] p-[14px]">
          <div className="flex items-center justify-between">
            <div className="grid gap-0.5">
              <strong className="text-xs text-[#1a241f]">Descrever refeição</strong>
              <span className="text-[10px] text-[#718078]">IA pode preencher os dados</span>
            </div>
            <span className="animate-pulse bg-gradient-to-r from-[#4aa9a1] via-[#6a92dc] to-[#df7fa8] bg-clip-text text-[11px] font-black tracking-[0.04em] text-transparent">IA</span>
          </div>
          <textarea
            className="h-[82px] min-h-[82px] w-full resize-y border-0 border-b border-[#d9e1dc] bg-transparent px-0 py-3 text-[13px] leading-[1.45] text-[#1a241f] outline-none placeholder:text-[#99a59f] focus:border-[#d9e1dc] focus:ring-0"
            value={description}
            onChange={(event) => onDescriptionChange(event.target.value)}
            placeholder="Ex.: 4 colheres de sopa de arroz e 2 ovos fritos"
            rows={3}
          />
          {error && <p className="text-[11px] font-extrabold text-[#a44e45]" role="alert">{error}</p>}
          <button type="button" className="min-h-11 w-full rounded-xl bg-[#35634f] text-xs font-extrabold text-white disabled:cursor-wait disabled:opacity-65" onClick={onAnalyze} disabled={analyzing}>
            {analyzing ? "Analisando..." : "Preencher com IA"}
          </button>
        </div>

        <div className="mb-2 mt-[18px] flex items-center justify-between px-0.5">
          <strong className="text-xs">Detalhes da refeição</strong>
          <span className="text-[10px] text-[#718078]">Você pode ajustar</span>
        </div>
        <div className="grid grid-cols-1 gap-[9px] rounded-[14px] border border-[#dde5df] bg-white p-3">
          <label className="grid gap-[6px] text-[10px] font-extrabold text-[#718078]">
            Refeição
            <select className={inputClass} name="category" defaultValue="Almoço">
              <option value="Café da manhã">Café da manhã</option>
              <option value="Almoço">Almoço</option>
              <option value="Café da tarde">Café da tarde</option>
              <option value="Janta">Janta</option>
              <option value="Ceia">Ceia</option>
            </select>
          </label>
          <label className="grid gap-[6px] text-[10px] font-extrabold text-[#718078]">
            Nome
            <input className={inputClass} name="name" type="text" required value={draft.name} onChange={(event) => update("name", event.target.value)} placeholder="Ex.: arroz, frango e salada" />
          </label>
          <label className="grid gap-[6px] text-[10px] font-extrabold text-[#718078]">
            Calorias
            <input className={inputClass} name="calories" type="number" min="0" required value={draft.calories} onChange={(event) => update("calories", event.target.value)} placeholder="kcal" />
          </label>
          <label className="grid gap-[6px] text-[10px] font-extrabold text-[#718078]">
            Proteínas
            <input className={inputClass} name="protein" type="number" min="0" step="0.1" value={draft.protein} onChange={(event) => update("protein", event.target.value)} placeholder="g" />
          </label>
          <label className="grid gap-[6px] text-[10px] font-extrabold text-[#718078]">
            Carboidratos
            <input className={inputClass} name="carbs" type="number" min="0" step="0.1" value={draft.carbs} onChange={(event) => update("carbs", event.target.value)} placeholder="g" />
          </label>
          <label className="grid gap-[6px] text-[10px] font-extrabold text-[#718078]">
            Gorduras
            <input className={inputClass} name="fat" type="number" min="0" step="0.1" value={draft.fat} onChange={(event) => update("fat", event.target.value)} placeholder="g" />
          </label>
        </div>
        <button className="mt-[14px] min-h-12 w-full rounded-xl bg-[#1a241f] text-xs font-extrabold text-white" type="submit">Registrar</button>
      </form>
    </div>
  );
}
