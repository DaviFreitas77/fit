"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { authClient } from "@/lib/auth-cliente";
import { loginSchema, type LoginFormValues } from "@/schemas/auth";
import { Spinner } from "@/components/Spinner";

export default function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: yupResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const submit = async (values: LoginFormValues) => {
    setFormError("");

    await authClient.signIn.email(
      { email: values.email, password: values.password, callbackURL: "/" },
      {
        onSuccess: () => router.replace("/"),
        onError: (error) => {
          setFormError(error.error.message || "Email ou senha inválidos.");
        },
      },
    );
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-3" noValidate>
      <label className="sr-only" htmlFor="login-email">Email</label>
      <input
        {...register("email")}
        id="login-email"
        type="email"
        autoComplete="email"
        placeholder="Email"
        className="h-[50px] w-full rounded-[14px] border border-[#dde5df] bg-[#fafbfa] px-4 text-[13px] font-semibold text-[#1a241f] outline-none placeholder:text-[#9aa69f]"
      />
      {errors.email && (
        <p className="px-1 text-xs font-semibold text-red-600">{errors.email.message}</p>
      )}

      <label className="sr-only" htmlFor="login-password">Senha</label>
      <div className="relative">
        <input
          {...register("password")}
          id="login-password"
          type={showPassword ? "text" : "password"}
          autoComplete="current-password"
          placeholder="Senha"
          className="h-[50px] w-full rounded-[14px] border border-[#dde5df] bg-[#fafbfa] px-4 pr-12 text-[13px] font-semibold text-[#1a241f] outline-none placeholder:text-[#9aa69f]"
        />
        <button
          type="button"
          onClick={() => setShowPassword((visible) => !visible)}
          className="absolute right-2 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-xl text-[#718078]"
          aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
        >
          {showPassword ? <FiEyeOff className="size-4" /> : <FiEye className="size-4" />}
        </button>
      </div>
      {errors.password && (
        <p className="px-1 text-xs font-semibold text-red-600">{errors.password.message}</p>
      )}
      {formError && (
        <p className="px-1 text-xs font-semibold text-red-600">{formError}</p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-1 flex h-[52px] w-full items-center justify-center gap-2 rounded-[14px] bg-[#1a241f] text-[13px] font-black text-white disabled:cursor-wait disabled:opacity-70"
      >
        {isSubmitting && <Spinner />}
        {isSubmitting ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}
