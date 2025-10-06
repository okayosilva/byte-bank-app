import { AnimatedView } from "@/components/animatedView";
import { FilterTransactions } from "@/components/filterTransactions";
import { SearchBar } from "@/components/searchBar";
import { useBottomSheetContext } from "@/context/bottomSheet.context";
import { useSnackbarContext } from "@/context/snackbar.context";
import { useTransactionContext } from "@/context/transaction.context";
import { useAnimatedView } from "@/utils/hooks/useAnimatedView";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FlatList, Text, View } from "react-native";
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
  const { openBottomSheet } = useBottomSheetContext();
  const [searchText, setSearchText] = useState("");
  const [hasActiveFilters, setHasActiveFilters] = useState(false);

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

  const handleClearSearch = useCallback(() => {
    setSearchText("");
  }, []);

  const handleOpenFilter = useCallback(() => {
    openBottomSheet(
      <FilterTransactions
        onFilterApplied={setHasActiveFilters}
        onClearSearch={handleClearSearch}
      />,
      0
    );
  }, [openBottomSheet, handleClearSearch]);

  const handleSearchChange = useCallback((text: string) => {
    setSearchText(text);
  }, []);

  const handleSearch = useCallback(async () => {
    try {
      if (searchText.trim()) {
        await fetchTransactions({ searchText: searchText.trim() });
      } else {
        await fetchTransactions();
      }
    } catch (error) {
      console.error("Erro ao buscar transações:", error);
    }
  }, [searchText, fetchTransactions]);

  const renderItem = useCallback(
    ({ item }: { item: any }) => <TransactionListCard transaction={item} />,
    []
  );

  const listHeaderComponent = useMemo(
    () => (
      <>
        <ListHeader totalTransactions={totalTransactions} />
        <View className="px-6 mb-2">
          <Text className="text-lg font-semibold text-background-secondary">
            Transações
          </Text>
          <Text className="text-sm text-gray-600">
            {transactions.length} {transactions.length === 1 ? "item" : "itens"}
          </Text>
        </View>
        <SearchBar
          value={searchText}
          onChangeText={handleSearchChange}
          onSearchPress={handleSearch}
          onFilterPress={handleOpenFilter}
          filterActive={hasActiveFilters}
        />
      </>
    ),
    [
      totalTransactions,
      transactions.length,
      searchText,
      hasActiveFilters,
      handleSearchChange,
      handleSearch,
      handleOpenFilter,
    ]
  );

  return (
    <SafeAreaView className="flex-1 ">
      <AnimatedView fadeAnim={fadeAnim}>
        <FlatList
          data={transactions}
          ListHeaderComponent={listHeaderComponent}
          keyExtractor={({ id }) => `transaction-${id}`}
          renderItem={renderItem}
        />
      </AnimatedView>
    </SafeAreaView>
  );
};
