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

export interface Insight {
  id: string;
  type: "success" | "warning" | "danger" | "info";
  title: string;
  description: string;
  icon: string;
  categoryName?: string;
  value?: number;
  percentage?: number;
  comparisonText?: string;
}

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
  fetchYearSummary: (year: string) => Promise<{
    income: number;
    expense: number;
    totalTransactions: number;
  }>;
  fetchTransactionsByYear: (year: number | null) => Promise<any[]>;
  fetchPeriodComparison: (
    currentStart: string,
    currentEnd: string,
    previousStart: string,
    previousEnd: string
  ) => Promise<Insight[]>;
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

  const deleteReceipt = async (
    receiptUrl: string,
    userId: string
  ): Promise<void> => {
    try {
      const url = new URL(receiptUrl);
      const pathParts = url.pathname.split(
        "/storage/v1/object/public/receipts/"
      );

      if (pathParts.length < 2) {
        return;
      }

      const filePath = pathParts[1];

      // Verifica se o arquivo pertence ao usuário antes de deletar
      if (!filePath.startsWith(`${userId}/`)) {
        console.error(
          "Tentativa de deletar arquivo de outro usuário bloqueada"
        );
        throw new Error("Você não tem permissão para deletar este arquivo");
      }

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
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("Usuário não está autenticado");
      }

      let query = supabase
        .from("transactions")
        .select("*", { count: "exact" })
        .eq("user_id", user.id);

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

        if (filters.categoryIds && filters.categoryIds.length > 0) {
          query = query.in("category_id", filters.categoryIds);
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
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("Usuário não está autenticado");
    }

    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return data || [];
  };

  const calculateTotalTransactions = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("Usuário não está autenticado");
    }

    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", user.id);

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
      .eq("user_id", user.id)
      .single();

    let receiptUrl = transaction.receipt_url;

    if (receiptUrl && receiptUrl.startsWith("file://")) {
      if (oldTransaction?.receipt_url) {
        await deleteReceipt(oldTransaction.receipt_url, user.id);
      }

      receiptUrl = await uploadReceipt(receiptUrl, user.id);
    } else if (!receiptUrl && oldTransaction?.receipt_url) {
      await deleteReceipt(oldTransaction.receipt_url, user.id);
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
      .eq("id", transactionId)
      .eq("user_id", user.id);

    if (error) {
      throw error;
    }

    await fetchTransactions({ page: 0 }, false);
  };

  const deleteTransaction = async (transactionId: number) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("Usuário não está autenticado");
    }

    const { data: transaction } = await supabase
      .from("transactions")
      .select("receipt_url")
      .eq("id", transactionId)
      .eq("user_id", user.id)
      .single();

    const { error } = await supabase
      .from("transactions")
      .delete()
      .eq("id", transactionId)
      .eq("user_id", user.id);

    if (error) {
      throw error;
    }

    if (transaction?.receipt_url) {
      await deleteReceipt(transaction.receipt_url, user.id);
    }

    await fetchTransactions({ page: 0 }, false);
  };

  const fetchYearSummary = async (year: string) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("Usuário não está autenticado");
    }

    const startDate = `${year}-01-01T00:00:00`;
    const endDate = `${year}-12-31T23:59:59`;

    // Busca com agregação no banco usando RPC (mais eficiente)
    const { data, error } = await supabase
      .from("transactions")
      .select("type_id, value")
      .eq("user_id", user.id)
      .gte("created_at", startDate)
      .lte("created_at", endDate);

    if (error) {
      throw error;
    }

    // Calcula totais
    const summary = (data || []).reduce(
      (acc, transaction) => {
        const value = transaction.value / 100;
        if (transaction.type_id === 1) {
          acc.income += value;
        } else if (transaction.type_id === 2) {
          acc.expense += value;
        }
        acc.totalTransactions++;
        return acc;
      },
      { income: 0, expense: 0, totalTransactions: 0 }
    );

    return summary;
  };

  const fetchTransactionsByYear = async (year: number | null) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("Usuário não está autenticado");
    }

    let query = supabase
      .from("transactions")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    // Se year é null ou 0, busca todas as transações
    if (year && year > 0) {
      const startDate = `${year}-01-01T00:00:00`;
      const endDate = `${year}-12-31T23:59:59`;
      query = query.gte("created_at", startDate).lte("created_at", endDate);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return data || [];
  };

  const fetchPeriodComparison = async (
    currentStart: string,
    currentEnd: string,
    previousStart: string,
    previousEnd: string
  ): Promise<Insight[]> => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("Usuário não está autenticado");
    }

    // Query otimizada para o período atual (apenas campos necessários)
    const { data: currentData, error: currentError } = await supabase
      .from("transactions")
      .select("category_id, value, type_id")
      .eq("user_id", user.id)
      .gte("created_at", currentStart)
      .lte("created_at", currentEnd);

    if (currentError) throw currentError;

    // Query otimizada para o período anterior
    const { data: previousData, error: previousError } = await supabase
      .from("transactions")
      .select("category_id, value, type_id")
      .eq("user_id", user.id)
      .gte("created_at", previousStart)
      .lte("created_at", previousEnd);

    if (previousError) throw previousError;

    // Agrupa por categoria
    const groupByCategory = (transactions: any[]) => {
      return transactions.reduce(
        (acc, t) => {
          if (!acc[t.category_id]) {
            acc[t.category_id] = { income: 0, expense: 0 };
          }
          const value = t.value / 100;
          if (t.type_id === 1) {
            acc[t.category_id].income += value;
          } else if (t.type_id === 2) {
            acc[t.category_id].expense += value;
          }
          return acc;
        },
        {} as Record<number, { income: number; expense: number }>
      );
    };

    const currentByCategory = groupByCategory(currentData || []);
    const previousByCategory = groupByCategory(previousData || []);

    // Calcula totais gerais
    const currentTotal = {
      income: Number(
        Object.values(currentByCategory).reduce(
          (sum, c: any) => sum + c.income,
          0
        )
      ),
      expense: Number(
        Object.values(currentByCategory).reduce(
          (sum, c: any) => sum + c.expense,
          0
        )
      ),
    };
    const previousTotal = {
      income: Number(
        Object.values(previousByCategory).reduce(
          (sum, c: any) => sum + c.income,
          0
        )
      ),
      expense: Number(
        Object.values(previousByCategory).reduce(
          (sum, c: any) => sum + c.expense,
          0
        )
      ),
    };

    const insights: Insight[] = [];

    // Insight 1: Comparação de receitas totais
    if (previousTotal.income > 0) {
      const incomeDiff = currentTotal.income - previousTotal.income;
      const incomePercentage = (incomeDiff / previousTotal.income) * 100;

      if (Math.abs(incomePercentage) >= 20) {
        insights.push({
          id: "income-total",
          type: incomePercentage > 0 ? "success" : "warning",
          title:
            incomePercentage > 0
              ? "Ótimo! Suas receitas aumentaram"
              : "Suas receitas diminuíram",
          description: `${Math.abs(incomeDiff).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })} (${Math.abs(incomePercentage).toFixed(0)}% vs período anterior)`,
          icon: incomePercentage > 0 ? "trending-up" : "trending-down",
          value: Math.abs(incomeDiff),
          percentage: Math.abs(incomePercentage),
        });
      }
    }

    // Insight 2: Comparação de despesas totais
    if (previousTotal.expense > 0) {
      const expenseDiff = currentTotal.expense - previousTotal.expense;
      const expensePercentage = (expenseDiff / previousTotal.expense) * 100;

      if (Math.abs(expensePercentage) >= 20) {
        insights.push({
          id: "expense-total",
          type: expenseDiff < 0 ? "success" : "danger",
          title:
            expenseDiff < 0
              ? "Parabéns! Você economizou"
              : "Atenção: Gastos aumentaram",
          description: `${Math.abs(expenseDiff).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })} (${Math.abs(expensePercentage).toFixed(0)}% vs período anterior)`,
          icon: expenseDiff < 0 ? "check-circle" : "warning",
          value: Math.abs(expenseDiff),
          percentage: Math.abs(expensePercentage),
        });
      }
    }

    // Insight 3: Maiores mudanças por categoria
    const categoryChanges: Array<{
      categoryId: number;
      diff: number;
      percentage: number;
      isExpense: boolean;
    }> = [];

    const allCategoryIds = new Set([
      ...Object.keys(currentByCategory).map(Number),
      ...Object.keys(previousByCategory).map(Number),
    ]);

    allCategoryIds.forEach((categoryId) => {
      const current = currentByCategory[categoryId] || {
        income: 0,
        expense: 0,
      };
      const previous = previousByCategory[categoryId] || {
        income: 0,
        expense: 0,
      };

      // Apenas despesas para simplificar
      if (previous.expense > 0) {
        const diff = current.expense - previous.expense;
        const percentage = (diff / previous.expense) * 100;

        if (Math.abs(percentage) >= 30) {
          categoryChanges.push({
            categoryId,
            diff,
            percentage,
            isExpense: true,
          });
        }
      }
    });

    // Ordena por maior mudança absoluta
    categoryChanges.sort(
      (a, b) => Math.abs(b.percentage) - Math.abs(a.percentage)
    );

    // Adiciona top 2 mudanças de categoria
    categoryChanges.slice(0, 2).forEach((change, index) => {
      const category = categories.find((c) => c.id === change.categoryId);
      if (!category) return;

      const isReduction = change.diff < 0;

      insights.push({
        id: `category-${change.categoryId}`,
        type: isReduction ? "success" : "warning",
        title: isReduction
          ? `Parabéns! Você economizou em ${category.name}`
          : `Atenção: Gastos com ${category.name} aumentaram`,
        description: `${Math.abs(change.diff).toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        })} (${Math.abs(change.percentage).toFixed(0)}% vs período anterior)`,
        icon: isReduction ? "savings" : "priority-high",
        categoryName: category.name,
        value: Math.abs(change.diff),
        percentage: Math.abs(change.percentage),
      });
    });

    // Limita a 4 insights mais relevantes
    return insights.slice(0, 4);
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
        fetchYearSummary,
        fetchTransactionsByYear,
        fetchPeriodComparison,
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
