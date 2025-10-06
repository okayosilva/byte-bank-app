import { AnimatedView } from "@/components/animatedView";
import { FilterTransactions } from "@/components/filterTransactions";
import { SearchBar } from "@/components/searchBar";
import { useBottomSheetContext } from "@/context/bottomSheet.context";
import { useSnackbarContext } from "@/context/snackbar.context";
import { useTransactionContext } from "@/context/transaction.context";
import { useAnimatedView } from "@/utils/hooks/useAnimatedView";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  View,
} from "react-native";
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
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeFilters, setActiveFilters] = useState<any>(undefined);

  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isLoadingRef = useRef(false);

  useEffect(() => {
    fadeIn();
  }, []);

  const { notify } = useSnackbarContext();

  const handleFetchCategories = async () => {
    try {
      await fetchCategories();
    } catch (error) {
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

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      handleSearchDebounced(text);
    }, 500);
  }, []);

  const handleSearchDebounced = useCallback(
    async (text: string) => {
      try {
        setCurrentPage(0);
        const filters = text.trim()
          ? { searchText: text.trim(), page: 0 }
          : { page: 0 };
        setActiveFilters(filters);
        await fetchTransactions(filters, false);
      } catch (error) {
        notify({
          message: "Erro ao buscar transações",
          type: "ERROR",
        });
      }
    },
    [fetchTransactions, notify]
  );

  const handleSearch = useCallback(async () => {
    try {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      setCurrentPage(0);
      const filters = searchText.trim()
        ? { searchText: searchText.trim(), page: 0 }
        : { page: 0 };
      setActiveFilters(filters);
      await fetchTransactions(filters, false);
    } catch (error) {
      notify({
        message: "Erro ao buscar transações",
        type: "ERROR",
      });
    }
  }, [searchText, fetchTransactions, notify]);

  const handleLoadMore = useCallback(async () => {
    if (isLoadingMore || !hasMore || isLoadingRef.current) {
      return;
    }

    try {
      isLoadingRef.current = true;
      setIsLoadingMore(true);

      const nextPage = currentPage + 1;

      const filters = {
        ...activeFilters,
        page: nextPage,
      };

      await fetchTransactions(filters, true);
      setCurrentPage(nextPage);
    } catch (error) {
      notify({
        message: "Erro ao carregar mais transações",
        type: "ERROR",
      });
    } finally {
      setIsLoadingMore(false);
      isLoadingRef.current = false;
    }
  }, [
    currentPage,
    isLoadingMore,
    hasMore,
    activeFilters,
    fetchTransactions,
    notify,
  ]);

  const handleRefresh = useCallback(async () => {
    try {
      setIsRefreshing(true);
      setCurrentPage(0);
      setSearchText("");
      setActiveFilters(undefined);
      setHasActiveFilters(false);

      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      await Promise.all([
        handleFetchCategories(),
        fetchTransactions({ page: 0 }, false),
      ]);
    } catch (error) {
      notify({
        message: "Erro ao atualizar",
        type: "ERROR",
      });
    } finally {
      setIsRefreshing(false);
    }
  }, [fetchTransactions, notify]);

  const renderItem = useCallback(
    ({ item }: { item: any }) => <TransactionListCard transaction={item} />,
    []
  );

  const listEmptyComponent = useMemo(() => {
    return (
      <View className="py-12 px-6 items-center">
        <Text className="text-lg font-semibold text-gray-700 mb-2">
          Nenhuma transação encontrada
        </Text>
        <Text className="text-sm text-gray-500 text-center">
          {searchText || hasActiveFilters
            ? "Tente ajustar os filtros ou buscar por outro termo"
            : "Comece adicionando sua primeira transação"}
        </Text>
      </View>
    );
  }, [searchText, hasActiveFilters]);

  const listFooterComponent = useMemo(() => {
    if (isLoadingMore) {
      return (
        <View className="py-6 items-center">
          <ActivityIndicator size="small" color="#ED4A4C" />
          <Text className="text-sm text-gray-600 mt-2">
            Carregando mais transações...
          </Text>
        </View>
      );
    }

    if (!hasMore && transactions.length > 0) {
      return (
        <View className="py-6 items-center">
          <Text className="text-sm text-gray-500">
            Você chegou ao fim da lista
          </Text>
        </View>
      );
    }

    return null;
  }, [isLoadingMore, hasMore, transactions.length]);

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

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  return (
    <SafeAreaView className="flex-1 ">
      <AnimatedView fadeAnim={fadeAnim}>
        <FlatList
          data={transactions}
          ListHeaderComponent={listHeaderComponent}
          ListFooterComponent={listFooterComponent}
          ListEmptyComponent={listEmptyComponent}
          keyExtractor={({ id }) => `transaction-${id}`}
          renderItem={renderItem}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.2}
          contentContainerStyle={{ paddingBottom: 80 }}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              colors={["#ED4A4C"]}
              tintColor="#ED4A4C"
              title="Atualizando..."
              titleColor="#6b7280"
            />
          }
          maxToRenderPerBatch={10}
          windowSize={5}
          removeClippedSubviews={true}
          initialNumToRender={10}
        />
      </AnimatedView>
    </SafeAreaView>
  );
};
