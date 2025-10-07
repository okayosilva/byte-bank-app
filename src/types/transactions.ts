type CreateTransactionProps = {
  type_id: number;
  category_id: number;
  value: number;
  description: string;
  receipt_url?: string;
  user_id?: string;
  created_at?: string;
};

type TransactionCategory = {
  id: number;
  name: string;
};

type TransactionFilters = {
  page?: number;
  perPage?: number;
  from?: Date;
  to?: Date;
  typeId?: number;
  searchText?: string;
  categoryIds?: number[];
  orderId?: string;
};

type Transaction = {
  id: number;
  value: number;
  description: string;
  category_id: number;
  type_id: number;
  user_id: string;
  receipt_url: string | null;
  created_at: string;
  updated_at: string | null;
  deleted_at: string | null;
};

type TransactionTypes = "income" | "expense";
type TotalAmountTransactions = {
  total: number;
  income: number;
  expense: number;
};

export type {
  CreateTransactionProps,
  TotalAmountTransactions,
  Transaction,
  TransactionCategory,
  TransactionFilters,
  TransactionTypes,
};
