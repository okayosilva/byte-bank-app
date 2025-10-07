import { colors } from "@/theme/colors";
import { MaterialIcons } from "@expo/vector-icons";
import { FC } from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface YearSelectorProps {
  selectedYear: number;
  onYearChange: (year: number) => void;
}

export const YearSelector: FC<YearSelectorProps> = ({
  selectedYear,
  onYearChange,
}) => {
  const currentYear = new Date().getFullYear();
  const years = [
    currentYear,
    currentYear - 1,
    currentYear - 2,
    currentYear - 3,
  ];

  return (
    <View className="mb-4">
      <Text
        className="text-sm font-medium mb-2"
        style={{ color: colors.gray[700] }}
      >
        Selecione o ano
      </Text>
      <View className="flex-row gap-2 flex-wrap">
        <TouchableOpacity
          onPress={() => onYearChange(0)}
          className="px-4 py-3 rounded-lg flex-row items-center gap-2"
          style={{
            backgroundColor:
              selectedYear === 0
                ? colors["accent-brand-background-primary"]
                : colors.gray[400],
          }}
          activeOpacity={0.8}
        >
          <MaterialIcons
            name="all-inclusive"
            size={16}
            color={selectedYear === 0 ? colors.white : colors.gray[700]}
          />
          <Text
            className="font-semibold"
            style={{
              color: selectedYear === 0 ? colors.white : colors.gray[700],
            }}
          >
            Todos
          </Text>
        </TouchableOpacity>

        {years.map((year) => (
          <TouchableOpacity
            key={year}
            onPress={() => onYearChange(year)}
            className="px-4 py-3 rounded-lg flex-row items-center gap-2"
            style={{
              backgroundColor:
                selectedYear === year
                  ? colors["accent-brand-background-primary"]
                  : colors.gray[400],
            }}
            activeOpacity={0.8}
          >
            <MaterialIcons
              name="calendar-today"
              size={16}
              color={selectedYear === year ? colors.white : colors.gray[700]}
            />
            <Text
              className="font-semibold"
              style={{
                color: selectedYear === year ? colors.white : colors.gray[700],
              }}
            >
              {year}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};
