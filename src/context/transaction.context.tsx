import { supabase } from "@/lib/supabase";
import {
  CreateTransactionProps,
  TotalAmountTransactions,
  Transaction,
  TransactionCategory,
  TransactionFilters,
} from "@/types/transactions";
import { decode } from "base64-arraybuffer";
import * as FileSystem from "expo-file-system/legacy";
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

  const deleteReceipt = async (receiptUrl: string): Promise<void> => {
    try {
      const url = new URL(receiptUrl);
      const pathParts = url.pathname.split(
        "/storage/v1/object/public/receipts/"
      );

      if (pathParts.length < 2) {
        return;
      }

      const filePath = pathParts[1];

      const { error } = await supabase.storage
        .from("receipts")
        .remove([filePath]);

      if (error) {
        console.error("Erro ao deletar comprovante:", error);
      }
    } catch (error) {
      console.error("Erro ao processar deleção do comprovante:", error);
    }
  };

  const uploadReceipt = async (
    uri: string,
    userId: string
  ): Promise<string> => {
    try {
      if (!uri || typeof uri !== "string") {
        throw new Error("URI inválida para upload");
      }

      const normalizedUri = uri.startsWith("file://") ? uri : `file://${uri}`;
      const fileExt = normalizedUri.split(".").pop()?.toLowerCase() || "jpg";

      const contentTypeMap: Record<string, string> = {
        jpg: "image/jpeg",
        jpeg: "image/jpeg",
        png: "image/png",
        gif: "image/gif",
        webp: "image/webp",
        bmp: "image/bmp",
      };

      const contentType = contentTypeMap[fileExt] || "image/jpeg";
      const fileName = `${userId}/${Date.now()}.${fileExt}`;

      const base64 = await FileSystem.readAsStringAsync(normalizedUri, {
        encoding: "base64",
      });

      if (!base64) {
        throw new Error("Falha ao ler o arquivo da imagem");
      }

      const arrayBuffer = decode(base64);

      const { data, error } = await supabase.storage
        .from("receipts")
        .upload(fileName, arrayBuffer, {
          contentType,
          upsert: false,
        });

      if (error) {
        throw new Error(`Erro no upload: ${error.message}`);
      }

      if (!data || !data.path) {
        throw new Error("Upload realizado mas path não foi retornado");
      }

      const { data: urlData } = supabase.storage
        .from("receipts")
        .getPublicUrl(data.path);

      return urlData.publicUrl;
    } catch (error) {
      console.error("Erro ao fazer upload do comprovante:", error);

      if (error instanceof Error) {
        if (error.message.includes("Bucket not found")) {
          throw new Error(
            "Bucket de armazenamento não configurado. Contate o administrador."
          );
        } else if (error.message.includes("Permission denied")) {
          throw new Error(
            "Sem permissão para fazer upload. Verifique as configurações."
          );
        }
        throw error;
      }

      throw new Error("Erro desconhecido ao fazer upload do comprovante");
    }
  };

  const createTransaction = async (transaction: CreateTransactionProps) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("Usuário não está autenticado");
    }

    const valueInCents = Math.round(transaction.value * 100);

    let receiptUrl = transaction.receipt_url;
    if (receiptUrl && receiptUrl.startsWith("file://")) {
      receiptUrl = await uploadReceipt(receiptUrl, user.id);
    }

    const transactionWithUser = {
      ...transaction,
      value: valueInCents,
      receipt_url: receiptUrl || null,
      user_id: user.id,
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("transactions")
      .insert(transactionWithUser)
      .select();

    if (error) {
      throw error;
    }

    await fetchTransactions({ page: 0 }, false);

    return data;
  };

  const fetchTransactions = useCallback(
    async (filters?: TransactionFilters, append: boolean = false) => {
      let query = supabase.from("transactions").select("*", { count: "exact" });

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
      }

      if (filters?.orderId) {
        query = query.order("id", {
          ascending: filters.orderId.toLowerCase() === "asc",
        });
      } else {
        query = query.order("created_at", { ascending: false });
      }

      const from = page * perPage;
      const to = from + perPage - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) {
        throw error;
      }

      const totalFetched = append
        ? transactions.length + (data?.length || 0)
        : data?.length || 0;
      setHasMore(count !== null && totalFetched < count);

      if (append) {
        setTransactions((prev) => {
          const existingIds = new Set(prev.map((t) => t.id));
          const newTransactions = (data || []).filter(
            (t) => !existingIds.has(t.id)
          );
          return [...prev, ...newTransactions];
        });
      } else {
        setTransactions(data || []);
      }

      if (!append) {
        await calculateTotalTransactions();
      }

      return data;
    },
    [transactions.length]
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
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("Usuário não está autenticado");
    }

    const valueInCents = Math.round(transaction.value * 100);

    const { data: oldTransaction } = await supabase
      .from("transactions")
      .select("receipt_url")
      .eq("id", transactionId)
      .single();

    let receiptUrl = transaction.receipt_url;

    if (receiptUrl && receiptUrl.startsWith("file://")) {
      if (oldTransaction?.receipt_url) {
        await deleteReceipt(oldTransaction.receipt_url);
      }

      receiptUrl = await uploadReceipt(receiptUrl, user.id);
    } else if (!receiptUrl && oldTransaction?.receipt_url) {
      await deleteReceipt(oldTransaction.receipt_url);
    }

    const updatedTransaction = {
      type_id: transaction.type_id,
      category_id: transaction.category_id,
      value: valueInCents,
      description: transaction.description,
      receipt_url: receiptUrl || null,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from("transactions")
      .update(updatedTransaction)
      .eq("id", transactionId);

    if (error) {
      throw error;
    }

    await fetchTransactions({ page: 0 }, false);
  };

  const deleteTransaction = async (transactionId: number) => {
    const { data: transaction } = await supabase
      .from("transactions")
      .select("receipt_url")
      .eq("id", transactionId)
      .single();

    const { error } = await supabase
      .from("transactions")
      .delete()
      .eq("id", transactionId);

    if (error) {
      throw error;
    }

    if (transaction?.receipt_url) {
      await deleteReceipt(transaction.receipt_url);
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
