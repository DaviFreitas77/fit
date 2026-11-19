"use client";

import { FormEvent } from "react";
import { type Profile } from "@/lib/nutrition";
import { ProfileForm } from "./ProfileForm";
import { motion } from "motion/react";

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
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };
  const modalVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1, delayChildren: 0.08 } },
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end justify-center bg-overlay/40 backdrop-blur-sm md:items-center"
      role="presentation"
      onMouseDown={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="max-h-[92vh] w-full overflow-y-auto rounded-t-[22px] bg-card px-4 pb-6 pt-5 shadow-2xl md:w-[min(520px,calc(100vw-32px))] md:rounded-[18px] md:p-6"
        onMouseDown={(event) => event.stopPropagation()}
        variants={modalVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="mb-[18px] flex items-start justify-between" variants={itemVariants}>
          <div>
            <p className="mb-[5px] text-xs font-black  text-brand">Cálculo automático</p>
            <h2 className="m-0 text-[22px] font-black">Meu perfil</h2>
          </div>
          <motion.button
            type="button"
            className="grid size-[34px] place-items-center rounded-full border border-border bg-card text-xl text-muted"
            onClick={onClose}
            aria-label="Fechar"
            whileTap={{ scale: 0.9 }}
          >
            ×
          </motion.button>
        </motion.div>
        <motion.div variants={itemVariants}>
          <ProfileForm profile={profile} activityChoice={activityChoice} onActivityChange={onActivityChange} onSubmit={onSubmit} submitLabel="Salvar perfil" />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
