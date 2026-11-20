
import * as yup from "yup";

export const userSchema = yup.object({
  name: yup
    .string()
    .trim()
    .required("Nome é obrigatório.")
    .min(3, "O nome precisa ter pelo menos 3 caracteres.")
    .max(100, "O nome pode ter no máximo 100 caracteres."),

  email: yup
    .string()
    .trim()
    .lowercase()
    .required("E-mail é obrigatório.")
    .email("Informe um e-mail válido."),

  dateOfBirth: yup
    .date()
    .typeError("Informe uma data de nascimento válida.")
    .required("Data de nascimento é obrigatória.")
    .max(new Date(), "A data de nascimento não pode ser futura."),

  password: yup
    .string()
    .required("Senha é obrigatória.")
    .min(8, "A senha precisa ter pelo menos 8 caracteres.")
    .max(72, "A senha pode ter no máximo 72 caracteres."),
});
