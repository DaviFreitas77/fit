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

export function MealModal({
  open,
  description,
  draft,
  analyzing,
  error,
  onDescriptionChange,
  onDraftChange,
  onAnalyze,
  onSubmit,
  onClose,
}: Props) {
  if (!open) return null;
  const update = (field: keyof MealDraft, value: string) =>
    onDraftChange({ ...draft, [field]: value });

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <form className="modal meal-modal" onSubmit={onSubmit} onMouseDown={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <div>
            <p className="eyebrow">Novo registro</p>
            <h2>Adicionar alimento</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Fechar">×</button>
        </div>

        <div className="meal-ai-section">
          <div className="meal-ai-heading">
            <div>
              <strong>Descrever refeição</strong>
              <span>IA pode preencher os dados</span>
            </div>
            <span className="ai-spark">IA</span>
          </div>
          <textarea
            value={description}
            onChange={(event) => onDescriptionChange(event.target.value)}
            placeholder="Ex.: 4 colheres de sopa de arroz e 2 ovos fritos"
            rows={3}
          />
          {error && <p className="meal-ai-error" role="alert">{error}</p>}
          <button
            type="button"
            className="analyze-button"
            onClick={onAnalyze}
            disabled={analyzing}
          >
            {analyzing ? "Analisando..." : "Preencher com IA"}
          </button>
        </div>

        <div className="meal-details-heading">
          <strong>Detalhes da refeição</strong>
          <span>Você pode ajustar</span>
        </div>
        <div className="meal-details-grid">
          <label className="meal-name-field">
            Refeição
            <select name="category" defaultValue="Almoço">
              <option value="Café da manhã">Café da manhã</option>
              <option value="Almoço">Almoço</option>
              <option value="Café da tarde">Café da tarde</option>
              <option value="Ceia">Ceia</option>
            </select>
          </label>
          <label className="meal-name-field">
            Nome
            <input name="name" type="text" required value={draft.name} onChange={(event) => update("name", event.target.value)} placeholder="Ex.: arroz, frango e salada" />
          </label>
          <label className="calorie-field">
            Calorias
            <input name="calories" type="number" min="0" required value={draft.calories} onChange={(event) => update("calories", event.target.value)} placeholder="kcal" />
          </label>
          <label>
            Proteínas
            <input name="protein" type="number" min="0" step="0.1" value={draft.protein} onChange={(event) => update("protein", event.target.value)} placeholder="g" />
          </label>
          <label>
            Carboidratos
            <input name="carbs" type="number" min="0" step="0.1" value={draft.carbs} onChange={(event) => update("carbs", event.target.value)} placeholder="g" />
          </label>
          <label>
            Gorduras
            <input name="fat" type="number" min="0" step="0.1" value={draft.fat} onChange={(event) => update("fat", event.target.value)} placeholder="g" />
          </label>
        </div>
        <button className="primary-button" type="submit">Registrar</button>
      </form>
    </div>
  );
}
