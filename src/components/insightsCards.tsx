import { Insight } from "@/context/transaction.context";
import { colors } from "@/theme/colors";
import { MaterialIcons } from "@expo/vector-icons";
import { FC } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";

interface InsightsCardsProps {
  insights: Insight[];
  isLoading?: boolean;
}

export const InsightsCards: FC<InsightsCardsProps> = ({
  insights,
  isLoading = false,
}) => {
  const getColorByType = (type: Insight["type"]) => {
    switch (type) {
      case "success":
        return {
          bg: colors["accent-brand-light"],
          icon: colors.white,
          text: colors.white,
        };
      case "warning":
        return {
          bg: "#F59E0B",
          icon: colors.white,
          text: colors.white,
        };
      case "danger":
        return {
          bg: colors["accent-red"],
          icon: colors.white,
          text: colors.white,
        };
      case "info":
        return {
          bg: colors["accent-brand-background-primary"],
          icon: colors.white,
          text: colors.white,
        };
      default:
        return {
          bg: colors.gray[400],
          icon: colors.gray[700],
          text: colors.gray[700],
        };
    }
  };

  const formatDescription = (insight: Insight) => {
    // Substitui "vs período anterior" pelo comparisonText personalizado
    if (
      insight.comparisonText &&
      insight.description.includes("vs período anterior")
    ) {
      return insight.description.replace(
        "vs período anterior",
        insight.comparisonText
      );
    }
    return insight.description;
  };

  const getInsightTitle = () => {
    if (insights.length > 0 && insights[0].comparisonText) {
      return `Insights Financeiros (${insights[0].comparisonText})`;
    }
    return "Insights Financeiros";
  };

  if (isLoading) {
    return (
      <View className="px-6 mb-6">
        <Text
          className="text-lg font-semibold mb-3"
          style={{ color: colors["background-secondary"] }}
        >
          Insights Financeiros
        </Text>
        <View
          className="rounded-2xl p-8 items-center justify-center"
          style={{ backgroundColor: colors.gray[400], minHeight: 120 }}
        >
          <ActivityIndicator
            size="large"
            color={colors["accent-brand-background-primary"]}
          />
          <Text className="text-sm mt-4" style={{ color: colors.gray[700] }}>
            Analisando seus dados...
          </Text>
        </View>
      </View>
    );
  }

  if (insights.length === 0) {
    return null;
  }

  return (
    <View className="px-6 mb-6">
      <Text
        className="text-lg font-semibold mb-3"
        style={{ color: colors["background-secondary"] }}
      >
        {getInsightTitle()}
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 12 }}
      >
        {insights.map((insight) => {
          const colorScheme = getColorByType(insight.type);
          return (
            <View
              key={insight.id}
              className="rounded-2xl p-5 min-w-[300]"
              style={{
                backgroundColor: colorScheme.bg,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
              }}
            >
              <View className="flex-row items-center mb-3">
                <MaterialIcons
                  name={insight.icon as any}
                  size={24}
                  color={colorScheme.icon}
                />
                {insight.percentage && (
                  <View
                    className="ml-auto px-3 py-1 rounded-full"
                    style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
                  >
                    <Text
                      className="text-xs font-bold"
                      style={{ color: colorScheme.text }}
                    >
                      {insight.percentage.toFixed(0)}%
                    </Text>
                  </View>
                )}
              </View>

              <Text
                className="text-sm font-semibold mb-2"
                style={{ color: colorScheme.text, opacity: 0.9 }}
              >
                {insight.title}
              </Text>

              <Text
                className="text-base font-bold"
                style={{ color: colorScheme.text }}
              >
                {formatDescription(insight)}
              </Text>

              {insight.categoryName && (
                <View
                  className="mt-3 pt-3"
                  style={{
                    borderTopWidth: 1,
                    borderTopColor: "rgba(255, 255, 255, 0.2)",
                  }}
                >
                  <Text
                    className="text-xs"
                    style={{ color: colorScheme.text, opacity: 0.8 }}
                  >
                    Categoria: {insight.categoryName}
                  </Text>
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};
