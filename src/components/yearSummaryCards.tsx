import { colors } from "@/theme/colors";
import { MaterialIcons } from "@expo/vector-icons";
import { FC } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";

interface YearSummaryCardsProps {
  year: string;
  income: number;
  expense: number;
  isLoading?: boolean;
  isEmpty?: boolean;
}

export const YearSummaryCards: FC<YearSummaryCardsProps> = ({
  year,
  income,
  expense,
  isLoading = false,
  isEmpty = false,
}) => {
  return (
    <View className="mb-4 px-6">
      <View className="mb-3">
        <Text
          className="text-lg font-bold"
          style={{ color: colors["background-secondary"] }}
        >
          Resumo Anual - {year}
        </Text>
        <Text className="text-sm" style={{ color: colors.gray[600] }}>
          {isLoading
            ? "Carregando dados..."
            : isEmpty
              ? "Nenhuma transação encontrada"
              : "Total de entradas e saídas do ano"}
        </Text>
      </View>

      {/* Loading State */}
      {isLoading && (
        <View
          className="rounded-2xl p-8 items-center justify-center"
          style={{
            backgroundColor: colors.gray[400],
            minHeight: 180,
          }}
        >
          <ActivityIndicator
            size="large"
            color={colors["accent-brand-background-primary"]}
          />
          <Text className="text-sm mt-4" style={{ color: colors.gray[700] }}>
            Buscando transações de {year}...
          </Text>
        </View>
      )}

      {/* Empty State */}
      {isEmpty && !isLoading && (
        <View
          className="rounded-2xl p-8 items-center justify-center"
          style={{
            backgroundColor: colors.gray[400],
            minHeight: 180,
          }}
        >
          <View
            className="w-16 h-16 rounded-full items-center justify-center mb-4"
            style={{ backgroundColor: colors.gray[300] }}
          >
            <MaterialIcons name="inbox" size={32} color={colors.white} />
          </View>
          <Text
            className="text-lg font-semibold mb-2"
            style={{ color: colors["background-secondary"] }}
          >
            Nenhuma transação em {year}
          </Text>
          <Text
            className="text-sm text-center"
            style={{ color: colors.gray[600] }}
          >
            Não foram encontradas transações{"\n"}neste período
          </Text>
        </View>
      )}

      {/* Cards com Dados */}
      {!isLoading && !isEmpty && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            gap: 12,
          }}
        >
          {/* Card de Entrada */}
          <View
            className="rounded-2xl p-5 min-w-[280]"
            style={{
              backgroundColor: colors["accent-brand-light"],
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.1,
              shadowRadius: 3.84,
              elevation: 5,
            }}
          >
            <View className="flex-row items-center justify-between mb-3">
              <View
                className="w-12 h-12 rounded-full items-center justify-center"
                style={{ backgroundColor: "rgba(255, 255, 255, 0.3)" }}
              >
                <MaterialIcons name="trending-up" size={24} color="#FFFFFF" />
              </View>
              <View
                className="px-3 py-1 rounded-full"
                style={{ backgroundColor: "rgba(255, 255, 255, 0.3)" }}
              >
                <Text className="text-xs font-semibold text-white">
                  ENTRADAS
                </Text>
              </View>
            </View>

            <Text className="text-sm text-white opacity-90 mb-1">
              Total de Entradas
            </Text>
            <Text className="text-3xl font-bold text-white">
              {income.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </Text>
            <Text className="text-xs text-white opacity-80 mt-2">
              Janeiro a Dezembro de {year}
            </Text>
          </View>

          {/* Card de Saída */}
          <View
            className="rounded-2xl p-5 min-w-[280]"
            style={{
              backgroundColor: colors["accent-red"],
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.1,
              shadowRadius: 3.84,
              elevation: 5,
            }}
          >
            <View className="flex-row items-center justify-between mb-3">
              <View
                className="w-12 h-12 rounded-full items-center justify-center"
                style={{ backgroundColor: "rgba(255, 255, 255, 0.3)" }}
              >
                <MaterialIcons name="trending-down" size={24} color="#FFFFFF" />
              </View>
              <View
                className="px-3 py-1 rounded-full"
                style={{ backgroundColor: "rgba(255, 255, 255, 0.3)" }}
              >
                <Text className="text-xs font-semibold text-white">SAÍDAS</Text>
              </View>
            </View>

            <Text className="text-sm text-white opacity-90 mb-1">
              Total de Saídas
            </Text>
            <Text className="text-3xl font-bold text-white">
              {expense.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </Text>
            <Text className="text-xs text-white opacity-80 mt-2">
              Janeiro a Dezembro de {year}
            </Text>
          </View>

          {/* Card de Saldo */}
          <View
            className="rounded-2xl p-5 min-w-[280]"
            style={{
              backgroundColor:
                income - expense >= 0
                  ? colors["accent-brand-background-primary"]
                  : colors["accent-red-background-primary"],
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.1,
              shadowRadius: 3.84,
              elevation: 5,
            }}
          >
            <View className="flex-row items-center justify-between mb-3">
              <View
                className="w-12 h-12 rounded-full items-center justify-center"
                style={{ backgroundColor: "rgba(255, 255, 255, 0.3)" }}
              >
                <MaterialIcons
                  name={
                    income - expense >= 0 ? "account-balance-wallet" : "warning"
                  }
                  size={24}
                  color="#FFFFFF"
                />
              </View>
              <View
                className="px-3 py-1 rounded-full"
                style={{ backgroundColor: "rgba(255, 255, 255, 0.3)" }}
              >
                <Text className="text-xs font-semibold text-white">SALDO</Text>
              </View>
            </View>

            <Text className="text-sm text-white opacity-90 mb-1">
              Saldo do Ano
            </Text>
            <Text className="text-3xl font-bold text-white">
              {(income - expense).toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </Text>
            <Text className="text-xs text-white opacity-80 mt-2">
              {income - expense >= 0 ? "Saldo positivo" : "Saldo negativo"}
            </Text>
          </View>
        </ScrollView>
      )}
    </View>
  );
};
