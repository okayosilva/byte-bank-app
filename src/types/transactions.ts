type CreateTransactionProps = {
  type_id: number;
  category_id: number;
  value: number;
  description: string;
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
  categoryIds?: number;
  orderId?: string;
};

type Transaction = {
  id: number;
  value: number;
  description: string;
  categoryId: number;
  typeId: number;
  type: {
    id: number;
    name: string;
  };
  category: {
    id: number;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
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
