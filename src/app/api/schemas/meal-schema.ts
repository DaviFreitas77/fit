import * as yup from "yup";

export const analyzeMealSchema = yup.object({
  description: yup
    .string()
    .trim()
    .required("Descreva os alimentos consumidos.")
    .min(10, "A descrição precisa ter pelo menos 10 caracteres."),
  hour: yup.number().integer().min(0).max(23).optional(),
});