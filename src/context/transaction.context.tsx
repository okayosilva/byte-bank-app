import { supabase } from "@/lib/supabase";
import {
  CreateTransactionProps,
  TransactionCategory,
} from "@/types/transactions";
import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useState,
} from "react";

type TransactionContextType = {
  fetchCategories: () => Promise<void>;
  categories: TransactionCategory[];
  createTransaction: (transaction: CreateTransactionProps) => Promise<any[]>;
};

export const TransactionContext = createContext({} as TransactionContextType);

export const TransactionContextProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const [categories, setCategories] = useState<TransactionCategory[]>([]);

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

    return data;
  };

  return (
    <TransactionContext.Provider
      value={{
        categories,
        fetchCategories,
        createTransaction,
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
