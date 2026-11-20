"use client";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import LoginForm from "@/components/auth/login-form";
import RegisterForm from "@/components/auth/register-form";

export default function AuthPage() {
  const [mode, setMode] = useState<"signup" | "login">("signup");
  const isSignup = mode === "signup";

  const switchMode = () => {
    setMode(isSignup ? "login" : "signup");
  };

  return (
    <main className="relative min-h-[100dvh] bg-white lg:grid lg:grid-cols-[44%_56%]">
      <div className="grid min-h-[100dvh] place-items-center px-5 py-8 sm:px-10 lg:px-12">
        <div className="w-full max-w-[430px]">
          <section className="w-full">
            <header className="mb-7 text-center">
              <h1 className="text-[28px] font-black leading-[1.1] tracking-[-0.04em] text-[#1a241f] sm:text-[32px]">
                {isSignup ? "Boas-vindas à Nutrição" : "Bem-vindo de volta"}
              </h1>
              <p className="mx-auto mt-3 max-w-[360px] text-[12px] leading-[1.6] text-[#718078]">
                {isSignup
                  ? "Crie sua conta e comece a acompanhar suas calorias e nutrientes todos os dias."
                  : "Acesse sua conta e continue acompanhando sua alimentação."}
              </p>
            </header>

            <button
              type="button"
              className="flex h-[52px] w-full items-center justify-center gap-3 rounded-[14px] border border-[#dfe6e1] bg-white text-[13px] font-bold text-[#344138] transition-colors hover:border-[#bfcac3] hover:bg-[#fafbfa]"
            >
              <FcGoogle className="size-5" />
              {isSignup ? "Cadastrar com Google" : "Entrar com Google"}
            </button>

            <div className="my-5 flex items-center gap-3" aria-hidden="true">
              <span className="h-px flex-1 bg-[#edf1ee]" />
              <span className="text-xs font-bold text-[#909b94]">ou</span>
              <span className="h-px flex-1 bg-[#edf1ee]" />
            </div>

            {isSignup ? <RegisterForm /> : <LoginForm />}

            {isSignup && (
              <p className="mx-auto mt-4 max-w-[390px] text-center text-[10px] leading-[1.65] text-[#7d8981]">
                Ao criar sua conta, você concorda com a{" "}
                <button
                  type="button"
                  className="font-bold underline underline-offset-2"
                >
                  Política de Privacidade
                </button>{" "}
                e os{" "}
                <button
                  type="button"
                  className="font-bold underline underline-offset-2"
                >
                  Termos de Serviço
                </button>
                .
              </p>
            )}

            <p className="mt-5 text-center text-[12px] font-semibold text-[#69766f]">
              {isSignup ? "Já tem uma conta?" : "Ainda não tem uma conta?"}{" "}
              <button
                type="button"
                onClick={switchMode}
                className="font-black text-[#1a241f] underline decoration-[#bfcac3] underline-offset-4"
              >
                {isSignup ? "Entrar" : "Criar conta"}
              </button>
            </p>
          </section>
        </div>
      </div>

      <aside className="hidden min-h-[100dvh] overflow-hidden border-l border-[#edf1ee] bg-[#eef3ef] p-7 lg:block xl:p-9">
        <div className="h-full min-h-[760px] overflow-hidden rounded-[22px] border border-white/80 bg-[#fbfcfb] shadow-[0_20px_60px_rgba(53,99,79,0.10)]">
          <div className="grid h-full grid-cols-[76px_minmax(0,1fr)]">
            <nav className="flex flex-col items-center border-r border-[#edf1ee] bg-white py-7">
              <div className="grid size-10 place-items-center rounded-[12px] bg-[#1a241f] text-white">
                <svg
                  className="w-5 fill-none stroke-white"
                  strokeWidth="1.8"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M7 20V9m5 11V4m5 16v-7M3 20h18" />
                </svg>
              </div>
              <div className="mt-9 grid gap-3">
                {[true, false, false, false].map((active, index) => (
                  <div
                    key={index}
                    className={`grid size-10 place-items-center rounded-[12px] ${active ? "bg-[#e8f1ec]" : "text-[#9aa69f]"}`}
                  >
                    <span
                      className={`block ${active ? "size-4 bg-[#4f8f72]" : "size-3 border-2 border-[#9aa69f]"}`}
                    />
                  </div>
                ))}
              </div>
            </nav>

            <div className="px-6 py-7 xl:px-8">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-black capitalize text-[#4f8f72]">
                    quinta-feira, 19 de novembro
                  </p>
                  <h2 className="mt-1 text-xl font-black tracking-[-0.04em] text-[#1a241f]">
                    Boa tarde
                  </h2>
                </div>
                <div className="size-9 rounded-full border-4 border-[#edf1ee] bg-[#d7e4dc]" />
              </div>

              <div className="mt-6 grid grid-cols-7 gap-2 rounded-[14px] border border-[#edf1ee] bg-white p-2">
                {["seg", "ter", "qua", "qui", "sex", "sab", "dom"].map(
                  (day, index) => (
                    <div
                      key={day}
                      className="grid place-items-center gap-1 py-1 text-[9px] font-bold text-[#9aa69f]"
                    >
                      <span>{day}</span>
                      <span
                        className={`grid size-7 place-items-center rounded-[8px] text-[10px] ${index === 3 ? "bg-[#35634f] text-white" : "text-[#1a241f]"}`}
                      >
                        {16 + index}
                      </span>
                    </div>
                  ),
                )}
              </div>

              <div className="mt-4 grid grid-cols-[1.25fr_.75fr] gap-4">
                <div className="rounded-[18px] border border-[#edf1ee] bg-white p-5">
                  <p className="text-[10px] font-bold text-[#718078]">
                    Calorias restantes
                  </p>
                  <p className="mt-2 text-[38px] font-black leading-none tracking-[-0.06em] text-[#1a241f]">
                    1.240
                  </p>
                  <p className="mt-2 text-[10px] text-[#718078]">
                    de 2.100 kcal
                  </p>
                  <div className="mt-5 h-2 rounded-full bg-[#edf1ee]">
                    <div className="h-full w-[41%] rounded-full bg-[#4f8f72]" />
                  </div>
                </div>
                <div className="rounded-[18px] border border-[#edf1ee] bg-white p-5">
                  <p className="text-[10px] font-bold text-[#718078]">
                    Consumidas
                  </p>
                  <p className="mt-2 text-[38px] font-black leading-none tracking-[-0.06em] text-[#1a241f]">
                    860
                  </p>
                  <p className="mt-2 text-[10px] text-[#718078]">kcal hoje</p>
                  <div className="mt-5 grid grid-cols-3 gap-2">
                    {[70, 45, 55].map((width, index) => (
                      <div key={index}>
                        <div className="h-1.5 rounded-full bg-[#edf1ee]">
                          <div
                            className={`h-full rounded-full ${index === 0 ? "bg-[#d99a67]" : index === 1 ? "bg-[#718fa8]" : "bg-[#4f8f72]"}`}
                            style={{ width: `${width}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-4">
                {[
                  ["Proteína", "84 g", "#d99a67"],
                  ["Carboidratos", "110 g", "#718fa8"],
                  ["Gorduras", "32 g", "#4f8f72"],
                ].map(([label, value, color]) => (
                  <div
                    key={label}
                    className="rounded-[16px] border border-[#edf1ee] bg-white p-4"
                  >
                    <div
                      className="mb-3 h-1.5 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                    <p className="text-[9px] font-bold text-[#718078]">
                      {label}
                    </p>
                    <p className="mt-1 text-sm font-black text-[#1a241f]">
                      {value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-4 rounded-[18px] border border-[#edf1ee] bg-white p-5">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-black text-[#1a241f]">
                    Refeições de hoje
                  </p>
                  <button
                    type="button"
                    className="rounded-[10px] bg-[#1a241f] px-3 py-2 text-[9px] font-black text-white"
                  >
                    Adicionar
                  </button>
                </div>
                {[
                  ["Café da manhã", "Aveia, banana e iogurte", "420 kcal"],
                  ["Almoço", "Frango, arroz e salada", "440 kcal"],
                ].map(([title, subtitle, calories]) => (
                  <div
                    key={title}
                    className="mt-3 flex items-center justify-between border-t border-[#edf1ee] pt-3"
                  >
                    <div>
                      <p className="text-[11px] font-black text-[#1a241f]">
                        {title}
                      </p>
                      <p className="mt-1 text-[9px] text-[#718078]">
                        {subtitle}
                      </p>
                    </div>
                    <p className="text-[10px] font-black text-[#4f8f72]">
                      {calories}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </aside>
    </main>
  );
}
