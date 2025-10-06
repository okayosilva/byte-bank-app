import { AnimatedView } from "@/components/animatedView";
import { Loading } from "@/components/loading";
import { useTransactionContext } from "@/context/transaction.context";
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
  const { fetchAllTransactions, categories, totalTransactions } =
    useTransactionContext();
  const [allTransactions, setAllTransactions] = useState<any[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const screenWidth = Dimensions.get("window").width;

  useEffect(() => {
    fadeIn();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadAllTransactions();
    }, [])
  );

  useEffect(() => {
    if (allTransactions.length > 0) {
      processMonthlyData();
      processCategoryData();
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, [allTransactions]);

  const loadAllTransactions = async () => {
    try {
      setIsLoading(true);
      const data = await fetchAllTransactions();
      setAllTransactions(data);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const processMonthlyData = () => {
    const last6Months: MonthlyData[] = [];
    const today = new Date();

    for (let i = 5; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
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

      last6Months.push({ month: monthName, income, expense });
    }

    setMonthlyData(last6Months);
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
      .filter((t) => t.type_id === 2) // Apenas despesas
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
          value,
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
    decimalPlaces: 0,
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
                      R$ {totalTransactions.income.toFixed(2)}
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
                      R$ {totalTransactions.expense.toFixed(2)}
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
                    R$ {totalTransactions.total.toFixed(2)}
                  </Text>
                </View>
              </View>

              {monthlyData.length > 0 && (
                <View className="px-6 mb-6">
                  <Text className="text-lg font-semibold text-background-secondary mb-3">
                    Evolução dos últimos 6 meses
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
                      R${" "}
                      {allTransactions.filter((t) => t.type_id === 2).length > 0
                        ? (
                            totalTransactions.expense /
                            allTransactions.filter((t) => t.type_id === 2)
                              .length
                          ).toFixed(2)
                        : "0.00"}
                    </Text>
                  </View>
                  <View className="flex-row justify-between items-center py-2">
                    <Text className="text-gray-700">Média de receitas</Text>
                    <Text className="text-background-secondary font-semibold">
                      R${" "}
                      {allTransactions.filter((t) => t.type_id === 1).length > 0
                        ? (
                            totalTransactions.income /
                            allTransactions.filter((t) => t.type_id === 1)
                              .length
                          ).toFixed(2)
                        : "0.00"}
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
