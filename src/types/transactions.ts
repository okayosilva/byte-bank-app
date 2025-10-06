type CreateTransactionProps = {
  type_id: number; // Corrigido para snake_case
  category_id: number; // Corrigido para snake_case
  value: number; // Valor em reais (será convertido para centavos no contexto)
  description: string;
  user_id?: string; // Será adicionado automaticamente no contexto
  created_at?: string; // Será adicionado automaticamente no contexto
};

type TransactionCategory = {
  id: number;
  name: string;
};

export type { CreateTransactionProps, TransactionCategory };
