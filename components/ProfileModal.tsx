"use client";

import { FormEvent } from "react";
import { type Profile } from "@/lib/nutrition";
import { ProfileForm } from "./ProfileForm";

type Props = {
  open: boolean;
  profile: Profile;
  activityChoice: number;
  onActivityChange: (value: number) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
};

export function ProfileModal({ open, profile, activityChoice, onActivityChange, onSubmit, onClose }: Props) {
  if (!open) return null;
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <div className="modal" onMouseDown={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <div>
            <p className="eyebrow">Cálculo automático</p>
            <h2>Meu perfil</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Fechar">×</button>
        </div>
        <ProfileForm
          profile={profile}
          activityChoice={activityChoice}
          onActivityChange={onActivityChange}
          onSubmit={onSubmit}
          submitLabel="Salvar perfil"
        />
      </div>
    </div>
  );
}
