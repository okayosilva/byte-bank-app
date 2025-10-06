import * as Yup from "yup";

export const newTransitionSchema = Yup.object({
  description: Yup.string().required("Descrição é obrigatória"),
  value: Yup.number()
    .min(0.01, "Valor deve ser no mínimo R$ 0,01")
    .required("Valor é obrigatório"),
  type_id: Yup.number()
    .min(1, "Selecione um tipo de transação")
    .required("Tipo é obrigatório"),
  category_id: Yup.number()
    .min(1, "Selecione uma categoria de transação")
    .required("Categoria é obrigatória"),
});
