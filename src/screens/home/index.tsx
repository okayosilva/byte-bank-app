import { AnimatedView } from "@/components/animatedView";
import { useSnackbarContext } from "@/context/snackbar.context";
import { useTransactionContext } from "@/context/transaction.context";
import { useAnimatedView } from "@/utils/hooks/useAnimatedView";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ListHeader } from "./list/listHeader";

export const Home = () => {
  const { fadeAnim, fadeIn } = useAnimatedView();
  const { fetchCategories, fetchTransactions, totalTransactions } =
    useTransactionContext();
  const [transactions, setTransactions] = useState<any[]>([]);

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
      const data = await fetchTransactions();
      setTransactions(data);
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
        <ListHeader totalTransactions={totalTransactions} />
      </AnimatedView>
    </SafeAreaView>
  );
};
