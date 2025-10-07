import { AnimatedView } from "@/components/animatedView";
import { FilterTransactions } from "@/components/filterTransactions";
import { SearchBar } from "@/components/searchBar";
import { YearSummaryCards } from "@/components/yearSummaryCards";
import { useBottomSheetContext } from "@/context/bottomSheet.context";
import { useSnackbarContext } from "@/context/snackbar.context";
import { useTransactionContext } from "@/context/transaction.context";
import { colors } from "@/theme/colors";
import { useAnimatedView } from "@/utils/hooks/useAnimatedView";
import { MaterialIcons } from "@expo/vector-icons";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  Animated,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
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
    fetchYearSummary,
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
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [yearSummary, setYearSummary] = useState<{
    year: string;
    income: number;
    expense: number;
  } | null>(null);
  const [isLoadingYear, setIsLoadingYear] = useState(false);

  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isLoadingRef = useRef(false);
  const flatListRef = useRef<FlatList>(null);
  const scrollButtonAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fadeIn();
  }, []);

  // Anima o botão de scroll to top
  useEffect(() => {
    Animated.spring(scrollButtonAnim, {
      toValue: showScrollToTop ? 1 : 0,
      useNativeDriver: true,
      friction: 8,
      tension: 40,
    }).start();
  }, [showScrollToTop]);

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

        // Detecta se é uma busca por ano (/YYYY)
        const yearRegex = /^\/(\d{4})$/;
        const yearMatch = text.trim().match(yearRegex);
        const isYearSearch = yearMatch !== null;

        if (isYearSearch) {
          const year = yearMatch![1];
          setIsLoadingYear(true);

          // Inicializa o yearSummary com loading
          setYearSummary({
            year,
            income: 0,
            expense: 0,
          });

          // Busca transações do ano para listagem
          const startDate = new Date(`${year}-01-01T00:00:00`);
          const endDate = new Date(`${year}-12-31T23:59:59`);

          const filters = {
            from: startDate,
            to: endDate,
            page: 0,
          };

          setActiveFilters(filters);

          // Busca otimizada do resumo anual (apenas type_id e value)
          const [summary] = await Promise.all([
            fetchYearSummary(year),
            fetchTransactions(filters, false),
          ]);

          setYearSummary({
            year,
            income: summary.income,
            expense: summary.expense,
          });
          setIsLoadingYear(false);
        } else {
          // Busca normal por texto
          setYearSummary(null);
          setIsLoadingYear(false);
          const filters = text.trim()
            ? { searchText: text.trim(), page: 0 }
            : { page: 0 };
          setActiveFilters(filters);
          await fetchTransactions(filters, false);
        }
      } catch (error) {
        setIsLoadingYear(false);
        notify({
          message: "Erro ao buscar transações",
          type: "ERROR",
        });
      }
    },
    [fetchTransactions, fetchYearSummary, notify]
  );

  const handleSearch = useCallback(async () => {
    try {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      setCurrentPage(0);

      // Detecta se é uma busca por ano (/YYYY)
      const yearRegex = /^\/(\d{4})$/;
      const yearMatch = searchText.trim().match(yearRegex);
      const isYearSearch = yearMatch !== null;

      if (isYearSearch) {
        const year = yearMatch![1];
        setIsLoadingYear(true);

        // Inicializa o yearSummary com loading
        setYearSummary({
          year,
          income: 0,
          expense: 0,
        });

        // Busca transações do ano para listagem
        const startDate = new Date(`${year}-01-01T00:00:00`);
        const endDate = new Date(`${year}-12-31T23:59:59`);

        const filters = {
          from: startDate,
          to: endDate,
          page: 0,
        };

        setActiveFilters(filters);

        // Busca otimizada do resumo anual (apenas type_id e value)
        const [summary] = await Promise.all([
          fetchYearSummary(year),
          fetchTransactions(filters, false),
        ]);

        setYearSummary({
          year,
          income: summary.income,
          expense: summary.expense,
        });
        setIsLoadingYear(false);
      } else {
        // Busca normal por texto
        setYearSummary(null);
        setIsLoadingYear(false);
        const filters = searchText.trim()
          ? { searchText: searchText.trim(), page: 0 }
          : { page: 0 };
        setActiveFilters(filters);
        await fetchTransactions(filters, false);
      }
    } catch (error) {
      setIsLoadingYear(false);
      notify({
        message: "Erro ao buscar transações",
        type: "ERROR",
      });
    }
  }, [searchText, fetchTransactions, fetchYearSummary, notify]);

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
      setYearSummary(null);
      setIsLoadingYear(false);

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

  const handleScroll = useCallback((event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    // Mostra o botão quando rolar mais de 300px para baixo
    setShowScrollToTop(offsetY > 300);
  }, []);

  const scrollToTop = useCallback(() => {
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  }, []);

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
        {yearSummary && (
          <YearSummaryCards
            year={yearSummary.year}
            income={yearSummary.income}
            expense={yearSummary.expense}
            isLoading={isLoadingYear}
            isEmpty={
              !isLoadingYear &&
              yearSummary.income === 0 &&
              yearSummary.expense === 0 &&
              transactions.length === 0
            }
          />
        )}
      </>
    ),
    [
      totalTransactions,
      transactions.length,
      searchText,
      hasActiveFilters,
      yearSummary,
      isLoadingYear,
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
          ref={flatListRef}
          data={transactions}
          ListHeaderComponent={listHeaderComponent}
          ListFooterComponent={listFooterComponent}
          ListEmptyComponent={listEmptyComponent}
          keyExtractor={({ id }) => `transaction-${id}`}
          renderItem={renderItem}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.2}
          onScroll={handleScroll}
          scrollEventThrottle={16}
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

        {/* Botão Scroll to Top */}
        <Animated.View
          style={{
            position: "absolute",
            bottom: 100,
            right: 20,
            opacity: scrollButtonAnim,
            transform: [
              {
                scale: scrollButtonAnim,
              },
              {
                translateY: scrollButtonAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [100, 0],
                }),
              },
            ],
          }}
          pointerEvents={showScrollToTop ? "auto" : "none"}
        >
          <TouchableOpacity
            onPress={scrollToTop}
            activeOpacity={0.8}
            style={{
              width: 56,
              height: 56,
              borderRadius: 28,
              backgroundColor: colors["accent-brand-background-primary"],
              justifyContent: "center",
              alignItems: "center",
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 4,
              },
              shadowOpacity: 0.3,
              shadowRadius: 4.65,
              elevation: 8,
            }}
          >
            <MaterialIcons name="arrow-upward" size={28} color="#FFFFFF" />
          </TouchableOpacity>
        </Animated.View>
      </AnimatedView>
    </SafeAreaView>
  );
};
