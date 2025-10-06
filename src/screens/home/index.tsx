import { AnimatedView } from "@/components/animatedView";
import { useSnackbarContext } from "@/context/snackbar.context";
import { useTransactionContext } from "@/context/transaction.context";
import { useAnimatedView } from "@/utils/hooks/useAnimatedView";
import React, { useEffect } from "react";
import { FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ListHeader } from "./list/listHeader";
import { TransactionListCard } from "./transactionCardList";

export const Home = () => {
  const { fadeAnim, fadeIn } = useAnimatedView();
  const {
    fetchCategories,
    fetchTransactions,
    totalTransactions,
    transactions,
  } = useTransactionContext();

  useEffect(() => {
    fadeIn();
  }, []);

  const { notify } = useSnackbarContext();

  const handleFetchCategories = async () => {
    try {
      await fetchCategories();
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
      notify({
        message: "Erro ao buscar categorias",
        type: "ERROR",
      });
    }
  };

  const handleFetchTransactions = async () => {
    try {
      await fetchTransactions();
    } catch (error) {
      console.error("Erro ao buscar transações:", error);
      notify({
        message: "Erro ao buscar transações",
        type: "ERROR",
      });
    }
  };

  useEffect(() => {
    (async () => {
      await Promise.all([handleFetchCategories(), handleFetchTransactions()]);
    })();
  }, []);

  return (
    <SafeAreaView className="flex-1 ">
      <AnimatedView fadeAnim={fadeAnim}>
        <FlatList
          data={transactions}
          ListHeaderComponent={() => (
            <ListHeader totalTransactions={totalTransactions} />
          )}
          keyExtractor={({ id }) => `transaction-${id}`}
          renderItem={({ item }) => <TransactionListCard transaction={item} />}
        />
      </AnimatedView>
    </SafeAreaView>
  );
};
