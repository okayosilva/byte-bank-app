import * as yup from "yup";

export const signupFormSchema = yup.object().shape({
  email: yup.string().email("E-mail inválido").required("E-mail é obrigatório"),
  password: yup
    .string()
    .min(8, "Senha deve ter pelo menos 8 caracteres")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
      "Senha deve conter pelo menos uma letra minúscula, uma maiúscula, um número e um caractere especial (@$!%*?&)"
    )
    .required("Senha é obrigatória"),
  name: yup
    .string()
    .required("Nome é obrigatório")
    .matches(/^[a-zA-ZÀ-ÿ\s]+$/, "Nome deve conter apenas letras")
    .min(3, "Nome deve ter pelo menos 3 caracteres"),
  confirmPassword: yup
    .string()
    .required("Confirmar senha é obrigatório")
    .oneOf([yup.ref("password")], "As senhas não coincidem"),
});
