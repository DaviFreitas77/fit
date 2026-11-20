import * as yup from "yup";

export interface LoginFormValues {
  email: string;
  password: string;
}

export interface SignupFormValues {
  name: string;
  dateOfBirth: Date;
  email: string;
  password: string;
}

const email = yup
  .string()
  .trim()
  .email("Informe um email válido")
  .required("Informe seu email");

const password = yup
  .string()
  .required("Informe sua senha")
  .min(6, "A senha deve ter pelo menos 6 caracteres");

export const loginSchema = yup.object({
  email: email.required("Informe seu email"),
  password: password.required("Informe sua senha"),
}) satisfies yup.ObjectSchema<LoginFormValues>;

export const signupSchema = yup.object({
  name: yup
    .string()
    .trim()
    .required("Informe seu nome")
    .min(2, "Informe um nome válido"),
  dateOfBirth: yup
    .date()
    .typeError("Informe uma data de nascimento válida")
    .required("Informe sua data de nascimento")
    .max(new Date(), "A data de nascimento não pode ser futura"),
  email: email.required("Informe seu email"),
  password: password.required("Informe sua senha"),
}) satisfies yup.ObjectSchema<SignupFormValues>;
