import * as yup from "yup";

export const loginFormSchema = yup.object().shape({
  email: yup.string().email("E-mail inválido").required("E-mail é obrigatório"),
  password: yup.string().min(8, "Senha deve ter pelo menos 8 caracteres").required("Senha é obrigatória"),
})