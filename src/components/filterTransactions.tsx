import { useBottomSheetContext } from "@/context/bottomSheet.context";
import { useSnackbarContext } from "@/context/snackbar.context";
import { useTransactionContext } from "@/context/transaction.context";
import { colors } from "@/theme/colors";
import { TransactionFilters } from "@/types/transactions";
import { MaterialIcons } from "@expo/vector-icons";
import {
  endOfMonth,
  endOfQuarter,
  endOfWeek,
  startOfMonth,
  startOfQuarter,
  startOfWeek,
  subMonths,
  subWeeks,
} from "date-fns";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { CheckboxComponent } from "./checkbox";
import { DateInput } from "./dateInput";

interface FilterTransactionsProps {
  onFilterApplied?: (hasFilters: boolean, filters?: any) => void;
  onClearSearch?: () => void;
}

export const FilterTransactions = ({
  onFilterApplied,
  onClearSearch,
}: FilterTransactionsProps) => {
  const { closeBottomSheet } = useBottomSheetContext();
  const { categories, fetchTransactions } = useTransactionContext();
  const { notify } = useSnackbarContext();

  const [fromDate, setFromDate] = useState<Date | undefined>();
  const [toDate, setToDate] = useState<Date | undefined>(new Date());
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedType, setSelectedType] = useState<number | undefined>();

  const handleCategoryToggle = (categoryId: number) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleTypeToggle = (typeId: number) => {
    setSelectedType((prev) => (prev === typeId ? undefined : typeId));
  };

  const handleQuickDateFilter = (
    filterType: "lastWeek" | "lastMonth" | "currentQuarter"
  ) => {
    const today = new Date();

    switch (filterType) {
      case "lastWeek":
        const lastWeekStart = startOfWeek(subWeeks(today, 1), {
          weekStartsOn: 0,
        }); // Domingo
        const lastWeekEnd = endOfWeek(subWeeks(today, 1), { weekStartsOn: 0 });
        setFromDate(lastWeekStart);
        setToDate(lastWeekEnd);
        break;

      case "lastMonth":
        const lastMonthStart = startOfMonth(subMonths(today, 1));
        const lastMonthEnd = endOfMonth(subMonths(today, 1));
        setFromDate(lastMonthStart);
        setToDate(lastMonthEnd);
        break;

      case "currentQuarter":
        const quarterStart = startOfQuarter(today);
        const quarterEnd = endOfQuarter(today);
        setFromDate(quarterStart);
        setToDate(quarterEnd);
        break;
    }
  };

  const handleClearFilters = async () => {
    setFromDate(undefined);
    setToDate(new Date());
    setSelectedCategories([]);
    setSelectedType(undefined);

    try {
      await fetchTransactions({ page: 0 }, false);
      onFilterApplied?.(false, undefined);
      onClearSearch?.(); // Limpar o campo de busca
      closeBottomSheet();
    } catch (error) {
      console.error("Erro ao limpar filtros:", error);
    }
  };

  const handleApplyFilters = async () => {
    const filters: TransactionFilters = { page: 0 };
    let hasFilters = false;

    // Data: só considera como filtro se pelo menos "De" estiver preenchido
    if (fromDate) {
      filters.from = fromDate;
      hasFilters = true;

      // Se "De" está preenchido, adiciona "Até" também
      if (toDate) {
        filters.to = toDate;
      }
    }

    if (selectedCategories.length > 0) {
      filters.categoryIds = selectedCategories;
      hasFilters = true;
    }

    if (selectedType) {
      filters.typeId = selectedType;
      hasFilters = true;
    }

    // Validação: só aplica filtro se pelo menos um campo foi preenchido
    if (!hasFilters) {
      notify({
        message: "Selecione pelo menos um filtro para aplicar",
        type: "ERROR",
      });
      return;
    }

    try {
      await fetchTransactions(filters, false);
      onFilterApplied?.(hasFilters, hasFilters ? filters : undefined);
      closeBottomSheet();
    } catch (error) {
      console.error("Erro ao aplicar filtros:", error);
    }
  };

  return (
    <View className="px-6 pb-8 pt-2 ">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-6">
        <Text
          className="text-xl font-semibold"
          style={{ color: colors["background-secondary"] }}
        >
          Filtrar transações
        </Text>
        <TouchableOpacity
          onPress={closeBottomSheet}
          activeOpacity={0.7}
          className="w-10 h-10 items-center justify-center"
        >
          <MaterialIcons name="close" size={28} color={colors.gray[700]} />
        </TouchableOpacity>
      </View>

      {/* Data */}
      <View className="mb-6">
        <Text
          className="text-base font-medium mb-3"
          style={{ color: colors["background-secondary"] }}
        >
          Período
        </Text>

        {/* Campos de Data */}
        <View className="flex-row gap-3 mb-3">
          <DateInput label="De" value={fromDate} onChange={setFromDate} />
          <DateInput label="Até" value={toDate} onChange={setToDate} />
        </View>

        {/* Filtros Rápidos */}
        <View className="mb-2">
          <Text
            className="text-xs font-medium mb-2"
            style={{ color: colors.gray[600] }}
          >
            Ou escolha um período:
          </Text>
          <View className="flex-row gap-2">
            <TouchableOpacity
              onPress={() => handleQuickDateFilter("lastWeek")}
              className="flex-1 py-3 rounded-lg items-center justify-center"
              style={{
                backgroundColor: colors["accent-brand-background-primary"],
              }}
              activeOpacity={0.8}
            >
              <MaterialIcons name="date-range" size={18} color="#FFFFFF" />
              <Text className="text-xs font-semibold text-white mt-1">
                Semana
              </Text>
              <Text className="text-xs font-semibold text-white opacity-80">
                Passada
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleQuickDateFilter("lastMonth")}
              className="flex-1 py-3 rounded-lg items-center justify-center"
              style={{
                backgroundColor: colors["accent-brand-background-primary"],
              }}
              activeOpacity={0.8}
            >
              <MaterialIcons name="calendar-today" size={18} color="#FFFFFF" />
              <Text className="text-xs font-semibold text-white mt-1">Mês</Text>
              <Text className="text-xs font-semibold text-white opacity-80">
                Passado
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleQuickDateFilter("currentQuarter")}
              className="flex-1 py-3 rounded-lg items-center justify-center"
              style={{
                backgroundColor: colors["accent-brand-background-primary"],
              }}
              activeOpacity={0.8}
            >
              <MaterialIcons name="event-note" size={18} color="#FFFFFF" />
              <Text className="text-xs font-semibold text-white mt-1">
                Trimestre
              </Text>
              <Text className="text-xs font-semibold text-white opacity-80">
                Atual
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Categoria */}
      <View className="mb-6">
        <Text
          className="text-base font-medium mb-2"
          style={{ color: colors["background-secondary"] }}
        >
          Categoria
        </Text>
        {categories.map((category) => (
          <CheckboxComponent
            key={category.id}
            label={category.name}
            checked={selectedCategories.includes(category.id)}
            onPress={() => handleCategoryToggle(category.id)}
          />
        ))}
      </View>

      {/* Tipo */}
      <View className="mb-8">
        <Text
          className="text-base font-medium mb-2"
          style={{ color: colors["background-secondary"] }}
        >
          Tipo
        </Text>
        <CheckboxComponent
          label="Entrada"
          checked={selectedType === 1}
          onPress={() => handleTypeToggle(1)}
        />
        <CheckboxComponent
          label="Saída"
          checked={selectedType === 2}
          onPress={() => handleTypeToggle(2)}
        />
      </View>

      {/* Botões */}
      <View className="flex-row gap-3">
        <TouchableOpacity
          onPress={handleClearFilters}
          className="flex-1 h-12 rounded-lg border-2 items-center justify-center"
          style={{ borderColor: colors["accent-brand-background-primary"] }}
          activeOpacity={0.7}
        >
          <Text
            className="font-medium text-base"
            style={{ color: colors["accent-brand-background-primary"] }}
          >
            Limpar filtro
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleApplyFilters}
          className="flex-1 h-12 rounded-lg items-center justify-center"
          style={{ backgroundColor: colors["accent-brand-background-primary"] }}
          activeOpacity={0.7}
        >
          <Text
            className="font-medium text-base"
            style={{ color: colors.white }}
          >
            Filtrar
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
