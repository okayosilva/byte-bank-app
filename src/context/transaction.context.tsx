import { supabase } from "@/lib/supabase";
import {
  CreateTransactionProps,
  TotalAmountTransactions,
  Transaction,
  TransactionCategory,
  TransactionFilters,
} from "@/types/transactions";
import {
  createContext,
  FC,
  PropsWithChildren,
  useCallback,
  useContext,
  useState,
} from "react";

type TransactionContextType = {
  fetchCategories: () => Promise<void>;
  categories: TransactionCategory[];
  createTransaction: (transaction: CreateTransactionProps) => Promise<any[]>;
  updateTransaction: (
    transactionId: number,
    transaction: CreateTransactionProps
  ) => Promise<void>;
  fetchTransactions: (
    filters?: TransactionFilters,
    append?: boolean
  ) => Promise<any[]>;
  fetchAllTransactions: () => Promise<Transaction[]>;
  calculateTotalTransactions: () => Promise<void>;
  totalTransactions: TotalAmountTransactions;
  transactions: Transaction[];
  deleteTransaction: (transactionId: number) => Promise<void>;
  hasMore: boolean;
};

export const TransactionContext = createContext({} as TransactionContextType);

export const TransactionContextProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const [categories, setCategories] = useState<TransactionCategory[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [totalTransactions, setTotalTransactions] =
    useState<TotalAmountTransactions>({
      total: 0,
      income: 0,
      expense: 0,
    });

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from("transaction_categories")
      .select("*");

    if (error) {
      throw error;
    }

    setCategories(data);
  };

  const createTransaction = async (transaction: CreateTransactionProps) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("Usuário não está autenticado");
    }

    const valueInCents = Math.round(transaction.value * 100);

    const transactionWithUser = {
      ...transaction,
      value: valueInCents,
      user_id: user.id,
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("transactions")
      .insert(transactionWithUser)
      .select();

    if (error) {
      console.error("Erro ao criar transação:", error);
      throw error;
    }

    // Atualizar a lista de transações após criar uma nova
    await fetchTransactions({ page: 0 }, false);

    return data;
  };

  const fetchTransactions = useCallback(
    async (filters?: TransactionFilters, append: boolean = false) => {
      let query = supabase.from("transactions").select("*");

      const defaultPage = 0;
      const defaultPerPage = 10;
      const page = filters?.page ?? defaultPage;
      const perPage = filters?.perPage ?? defaultPerPage;

      if (filters) {
        if (filters.searchText) {
          query = query.ilike("description", `%${filters.searchText}%`);
        }

        if (filters.typeId) {
          query = query.eq("type_id", filters.typeId);
        }

        if (filters.categoryIds) {
          query = query.in("category_id", [filters.categoryIds]);
        }

        if (filters.from) {
          query = query.gte("created_at", filters.from);
        }

        if (filters.to) {
          query = query.lte("created_at", filters.to);
        }

        if (filters.orderId) {
          query = query.order("id", {
            ascending: filters.orderId.toLowerCase() === "asc",
          });
        }
      }

      const from = page * perPage;
      const to = from + perPage - 1;
      query = query.range(from, to);

      query = query.order("created_at", { ascending: false });

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      // Verificar se tem mais dados
      setHasMore(data && data.length === perPage);

      // Adicionar ou substituir transações
      if (append) {
        setTransactions((prev) => [...prev, ...(data || [])]);
      } else {
        setTransactions(data || []);
      }

      // Sempre calcular os totais gerais sem aplicar filtros
      await calculateTotalTransactions();

      return data;
    },
    []
  );

  const fetchAllTransactions = async (): Promise<Transaction[]> => {
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return data || [];
  };

  const calculateTotalTransactions = async () => {
    // Sempre busca todos os dados para calcular os totais gerais
    const query = supabase.from("transactions").select("*");

    const { data, error } = await query;
    if (error) {
      throw error;
    }

    if (!data) {
      setTotalTransactions({
        total: 0,
        income: 0,
        expense: 0,
      });
      return;
    }

    const totals = data.reduce(
      (acc, transaction) => {
        const value = transaction.value / 100;

        if (transaction.type_id === 1) {
          acc.income += value;
        } else if (transaction.type_id === 2) {
          acc.expense += value;
        }

        acc.total = acc.income - acc.expense;
        return acc;
      },
      { total: 0, income: 0, expense: 0 }
    );

    setTotalTransactions(totals);
  };

  const updateTransaction = async (
    transactionId: number,
    transaction: CreateTransactionProps
  ) => {
    const valueInCents = Math.round(transaction.value * 100);

    const updatedTransaction = {
      type_id: transaction.type_id,
      category_id: transaction.category_id,
      value: valueInCents,
      description: transaction.description,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from("transactions")
      .update(updatedTransaction)
      .eq("id", transactionId);

    if (error) {
      console.error("Erro ao atualizar transação:", error);
      throw error;
    }

    await fetchTransactions({ page: 0 }, false);
  };

  const deleteTransaction = async (transactionId: number) => {
    const { error } = await supabase
      .from("transactions")
      .delete()
      .eq("id", transactionId);

    if (error) {
      throw error;
    }

    await fetchTransactions({ page: 0 }, false);
  };

  return (
    <TransactionContext.Provider
      value={{
        categories,
        fetchCategories,
        createTransaction,
        updateTransaction,
        fetchTransactions,
        fetchAllTransactions,
        calculateTotalTransactions,
        totalTransactions,
        transactions,
        deleteTransaction,
        hasMore,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactionContext = () => {
  const context = useContext(TransactionContext);

  if (!context) {
    throw new Error(
      "useTransactionContext must be used within an TransactionContextProvider"
    );
  }

  return context;
};
