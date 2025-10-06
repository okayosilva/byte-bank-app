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
    hasMore,
  } = useTransactionContext();
  const { openBottomSheet } = useBottomSheetContext();
  const [searchText, setSearchText] = useState("");
  const [hasActiveFilters, setHasActiveFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [activeFilters, setActiveFilters] = useState<any>(undefined);

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
      await fetchTransactions({ page: 0 }, false);
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
    setCurrentPage(0);
    setActiveFilters(undefined);
  }, []);

  const handleFilterApplied = useCallback(
    (hasFilters: boolean, filters?: any) => {
      setHasActiveFilters(hasFilters);
      setCurrentPage(0);
      setActiveFilters(filters);
    },
    []
  );

  const handleOpenFilter = useCallback(() => {
    openBottomSheet(
      <FilterTransactions
        onFilterApplied={handleFilterApplied}
        onClearSearch={handleClearSearch}
      />,
      0
    );
  }, [openBottomSheet, handleClearSearch, handleFilterApplied]);

  const handleSearchChange = useCallback((text: string) => {
    setSearchText(text);
  }, []);

  const handleSearch = useCallback(async () => {
    try {
      setCurrentPage(0);
      const filters = searchText.trim()
        ? { searchText: searchText.trim(), page: 0 }
        : { page: 0 };
      setActiveFilters(filters);
      await fetchTransactions(filters, false);
    } catch (error) {
      console.error("Erro ao buscar transações:", error);
    }
  }, [searchText, fetchTransactions]);

  const handleLoadMore = useCallback(async () => {
    if (isLoadingMore || !hasMore) return;

    try {
      setIsLoadingMore(true);
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);

      const filters = {
        ...activeFilters,
        page: nextPage,
      };

      await fetchTransactions(filters, true);
    } catch (error) {
      console.error("Erro ao carregar mais transações:", error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [currentPage, isLoadingMore, hasMore, activeFilters, fetchTransactions]);

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
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isLoadingMore ? (
              <View className="py-4">
                <Text className="text-center text-gray-600">Carregando...</Text>
              </View>
            ) : null
          }
        />
      </AnimatedView>
    </SafeAreaView>
  );
};
