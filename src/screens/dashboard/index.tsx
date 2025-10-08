import { AnimatedView } from "@/components/animatedView";
import { InsightsCards } from "@/components/insightsCards";
import { Loading } from "@/components/loading";
import { YearSelector } from "@/components/yearSelector";
import { Insight, useTransactionContext } from "@/context/transaction.context";
import { colors } from "@/theme/colors";
import { useAnimatedView } from "@/utils/hooks/useAnimatedView";
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import { Dimensions, ScrollView, Text, View } from "react-native";
import { LineChart, PieChart } from "react-native-chart-kit";
import { SafeAreaView } from "react-native-safe-area-context";

interface MonthlyData {
  month: string;
  income: number;
  expense: number;
}

interface CategoryData {
  name: string;
  value: number;
  color: string;
  legendFontColor: string;
  legendFontSize: number;
}

export const Dashboard = () => {
  const { fadeAnim, fadeIn } = useAnimatedView();
  const { fetchTransactionsByYear, categories, fetchPeriodComparison } =
    useTransactionContext();
  const [allTransactions, setAllTransactions] = useState<any[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState<number>(0);
  const [filteredTotals, setFilteredTotals] = useState({
    income: 0,
    expense: 0,
    total: 0,
  });
  const [insights, setInsights] = useState<Insight[]>([]);
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);

  const screenWidth = Dimensions.get("window").width;

  useEffect(() => {
    fadeIn();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadAllTransactions();
    }, [selectedYear])
  );

  useEffect(() => {
    loadAllTransactions();
  }, [selectedYear]);

  useEffect(() => {
    if (allTransactions.length > 0) {
      calculateFilteredTotals();
      processMonthlyData();
      processCategoryData();
      setIsLoading(false);
    } else {
      setFilteredTotals({ income: 0, expense: 0, total: 0 });
      setIsLoading(false);
    }
  }, [allTransactions]);

  const calculateFilteredTotals = () => {
    const income = allTransactions
      .filter((t) => t.type_id === 1)
      .reduce((sum, t) => sum + t.value / 100, 0);

    const expense = allTransactions
      .filter((t) => t.type_id === 2)
      .reduce((sum, t) => sum + t.value / 100, 0);

    setFilteredTotals({
      income,
      expense,
      total: income - expense,
    });
  };

  const loadAllTransactions = async () => {
    try {
      setIsLoading(true);
      const year = selectedYear === 0 ? null : selectedYear;
      const data = await fetchTransactionsByYear(year);
      setAllTransactions(data);

      loadInsights();
    } catch (error) {
      setIsLoading(false);
    }
  };

  const loadInsights = async () => {
    try {
      setIsLoadingInsights(true);

      const formatDate = (date: Date) => date.toISOString();
      let currentStart: string;
      let currentEnd: string;
      let previousStart: string;
      let previousEnd: string;

      if (selectedYear === 0) {
        const now = new Date();
        const currentMonthStart = new Date(
          now.getFullYear(),
          now.getMonth(),
          1
        );
        const currentMonthEnd = new Date(
          now.getFullYear(),
          now.getMonth() + 1,
          0,
          23,
          59,
          59
        );

        const previousMonthStart = new Date(
          now.getFullYear(),
          now.getMonth() - 1,
          1
        );
        const previousMonthEnd = new Date(
          now.getFullYear(),
          now.getMonth(),
          0,
          23,
          59,
          59
        );

        currentStart = formatDate(currentMonthStart);
        currentEnd = formatDate(currentMonthEnd);
        previousStart = formatDate(previousMonthStart);
        previousEnd = formatDate(previousMonthEnd);
      } else {
        const currentYearStart = new Date(selectedYear, 0, 1);
        const currentYearEnd = new Date(selectedYear, 11, 31, 23, 59, 59);

        const previousYearStart = new Date(selectedYear - 1, 0, 1);
        const previousYearEnd = new Date(selectedYear - 1, 11, 31, 23, 59, 59);

        currentStart = formatDate(currentYearStart);
        currentEnd = formatDate(currentYearEnd);
        previousStart = formatDate(previousYearStart);
        previousEnd = formatDate(previousYearEnd);
      }

      const insightsData = await fetchPeriodComparison(
        currentStart,
        currentEnd,
        previousStart,
        previousEnd
      );

      const comparisonText =
        selectedYear === 0 ? "vs mês anterior" : `vs ${selectedYear - 1}`;

      const enrichedInsights = insightsData.map((insight) => ({
        ...insight,
        comparisonText,
      }));

      setInsights(enrichedInsights);
      setIsLoadingInsights(false);
    } catch (error) {
      console.error("Erro ao carregar insights:", error);
      setIsLoadingInsights(false);
    }
  };

  const processMonthlyData = () => {
    const monthsData: MonthlyData[] = [];
    const referenceYear =
      selectedYear === 0 ? new Date().getFullYear() : selectedYear;

    const monthsToShow = selectedYear === 0 ? 6 : 12;
    const startIndex = selectedYear === 0 ? 5 : 11;

    for (let i = startIndex; i >= startIndex - (monthsToShow - 1); i--) {
      const date =
        selectedYear === 0
          ? new Date(new Date().getFullYear(), new Date().getMonth() - i, 1)
          : new Date(referenceYear, i, 1);

      const monthName = date.toLocaleDateString("pt-BR", { month: "short" });

      const monthTransactions = allTransactions.filter((t) => {
        const transactionDate = new Date(t.created_at);
        return (
          transactionDate.getMonth() === date.getMonth() &&
          transactionDate.getFullYear() === date.getFullYear()
        );
      });

      const income = monthTransactions
        .filter((t) => t.type_id === 1)
        .reduce((sum, t) => sum + t.value / 100, 0);

      const expense = monthTransactions
        .filter((t) => t.type_id === 2)
        .reduce((sum, t) => sum + t.value / 100, 0);

      monthsData.push({ month: monthName, income, expense });
    }

    setMonthlyData(monthsData);
  };

  const processCategoryData = () => {
    const chartColors = [
      "#ED4A4C",
      "#00875F",
      "#5A86F7",
      "#F75A68",
      "#00B37E",
      "#284DAA",
    ];

    const categoryTotals: { [key: number]: number } = {};

    allTransactions
      .filter((t) => t.type_id === 2)
      .forEach((t) => {
        if (!categoryTotals[t.category_id]) {
          categoryTotals[t.category_id] = 0;
        }
        categoryTotals[t.category_id] += t.value / 100;
      });

    const data: CategoryData[] = Object.entries(categoryTotals)
      .map(([categoryId, value], index) => {
        const category = categories.find((c) => c.id === parseInt(categoryId));
        return {
          name: category?.name || "Outros",
          value: parseFloat(value.toFixed(2)),
          color: chartColors[index % chartColors.length],
          legendFontColor: colors.gray[800],
          legendFontSize: 12,
        };
      })
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);

    setCategoryData(data);
  };

  const chartConfig = {
    backgroundColor: colors.white,
    backgroundGradientFrom: colors.white,
    backgroundGradientTo: colors.white,
    decimalPlaces: 2,
    color: (opacity = 1) => `rgba(237, 74, 76, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(50, 50, 56, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "4",
      strokeWidth: "2",
      stroke: colors["accent-brand-background-primary"],
    },
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background-primary">
        <Loading />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: colors["background-primary"] }}
    >
      <AnimatedView fadeAnim={fadeAnim} style={{ flex: 1 }}>
        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 80 }}
        >
          <View className="px-6 py-4">
            <Text className="text-2xl font-bold text-background-secondary">
              Dashboard
            </Text>
            <Text className="text-sm text-gray-600 mt-1">
              Visualize seus dados financeiros
            </Text>
          </View>

          <View className="px-6 mb-4">
            <YearSelector
              selectedYear={selectedYear}
              onYearChange={setSelectedYear}
            />
          </View>

          {allTransactions.length === 0 ? (
            <View className="flex-1 items-center justify-center px-6 py-20">
              <MaterialIcons
                name="analytics"
                size={80}
                color={colors.gray[400]}
              />
              <Text className="text-xl font-semibold text-gray-700 mt-6 text-center">
                Nenhuma transação encontrada
              </Text>
              <Text className="text-sm text-gray-600 mt-2 text-center">
                Adicione transações para visualizar seus dados no dashboard
              </Text>
            </View>
          ) : (
            <>
              <View className="px-6 mb-4">
                <View className="flex-row justify-between gap-3">
                  <View
                    className="flex-1 p-4 rounded-xl"
                    style={{ backgroundColor: colors["accent-brand-light"] }}
                  >
                    <MaterialIcons
                      name="trending-up"
                      size={24}
                      color={colors.white}
                    />
                    <Text className="text-white text-sm mt-2">Receitas</Text>
                    <Text className="text-white text-xl font-bold mt-1">
                      {filteredTotals.income.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </Text>
                  </View>

                  <View
                    className="flex-1 p-4 rounded-xl"
                    style={{ backgroundColor: colors["accent-red"] }}
                  >
                    <MaterialIcons
                      name="trending-down"
                      size={24}
                      color={colors.white}
                    />
                    <Text className="text-white text-sm mt-2">Despesas</Text>
                    <Text className="text-white text-xl font-bold mt-1">
                      {filteredTotals.expense.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </Text>
                  </View>
                </View>

                <View
                  className="w-full p-4 rounded-xl mt-3"
                  style={{ backgroundColor: colors["accent-brand"] }}
                >
                  <MaterialIcons
                    name="account-balance-wallet"
                    size={24}
                    color={colors.white}
                  />
                  <Text className="text-white text-sm mt-2">Saldo</Text>
                  <Text className="text-white text-2xl font-bold mt-1">
                    {filteredTotals.total.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </Text>
                </View>
              </View>

              <InsightsCards
                insights={insights}
                isLoading={isLoadingInsights}
              />

              {monthlyData.length > 0 && (
                <View className="px-6 mb-6">
                  <Text className="text-lg font-semibold text-background-secondary mb-3">
                    {selectedYear === 0
                      ? "Evolução dos últimos 6 meses"
                      : `Evolução mensal de ${selectedYear}`}
                  </Text>
                  <View
                    className="rounded-2xl overflow-hidden"
                    style={{
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.1,
                      shadowRadius: 4,
                      elevation: 3,
                    }}
                  >
                    <LineChart
                      data={{
                        labels: monthlyData.map((d) => d.month),
                        datasets: [
                          {
                            data: monthlyData.map((d) => d.income),
                            color: (opacity = 1) =>
                              `rgba(0, 179, 126, ${opacity})`,
                            strokeWidth: 2,
                          },
                          {
                            data: monthlyData.map((d) => d.expense),
                            color: (opacity = 1) =>
                              `rgba(237, 74, 76, ${opacity})`,
                            strokeWidth: 2,
                          },
                        ],
                        legend: ["Receitas", "Despesas"],
                      }}
                      width={screenWidth - 48}
                      height={220}
                      chartConfig={chartConfig}
                      bezier
                      style={{
                        borderRadius: 16,
                      }}
                    />
                  </View>
                </View>
              )}

              {categoryData.length > 0 && (
                <View className="px-6 mb-6">
                  <Text className="text-lg font-semibold text-background-secondary mb-3">
                    Despesas por categoria
                  </Text>
                  <View
                    className="rounded-2xl overflow-hidden bg-white"
                    style={{
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.1,
                      shadowRadius: 4,
                      elevation: 3,
                    }}
                  >
                    <PieChart
                      data={categoryData}
                      width={screenWidth - 48}
                      height={220}
                      chartConfig={chartConfig}
                      accessor="value"
                      backgroundColor="transparent"
                      paddingLeft="15"
                      center={[10, 0]}
                      absolute
                    />
                  </View>
                </View>
              )}

              <View className="px-6 mb-6">
                <Text className="text-lg font-semibold text-background-secondary mb-3">
                  Estatísticas
                </Text>
                <View className="bg-white rounded-2xl p-4 space-y-3">
                  <View className="flex-row justify-between items-center py-2 border-b border-gray-200">
                    <Text className="text-gray-700">Total de transações</Text>
                    <Text className="text-background-secondary font-semibold">
                      {allTransactions.length}
                    </Text>
                  </View>
                  <View className="flex-row justify-between items-center py-2 border-b border-gray-200">
                    <Text className="text-gray-700">Média de despesas</Text>
                    <Text className="text-background-secondary font-semibold">
                      {allTransactions.filter((t) => t.type_id === 2).length > 0
                        ? (
                            filteredTotals.expense /
                            allTransactions.filter((t) => t.type_id === 2)
                              .length
                          ).toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })
                        : "R$ 0,00"}
                    </Text>
                  </View>
                  <View className="flex-row justify-between items-center py-2">
                    <Text className="text-gray-700">Média de receitas</Text>
                    <Text className="text-background-secondary font-semibold">
                      {allTransactions.filter((t) => t.type_id === 1).length > 0
                        ? (
                            filteredTotals.income /
                            allTransactions.filter((t) => t.type_id === 1)
                              .length
                          ).toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })
                        : "R$ 0,00"}
                    </Text>
                  </View>
                </View>
              </View>
            </>
          )}
        </ScrollView>
      </AnimatedView>
    </SafeAreaView>
  );
};
