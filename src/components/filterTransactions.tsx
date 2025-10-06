import { useBottomSheetContext } from "@/context/bottomSheet.context";
import { useTransactionContext } from "@/context/transaction.context";
import { colors } from "@/theme/colors";
import { TransactionFilters } from "@/types/transactions";
import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { CheckboxComponent } from "./checkbox";
import { DateInput } from "./dateInput";

interface FilterTransactionsProps {
  onFilterApplied?: (hasFilters: boolean) => void;
  onClearSearch?: () => void;
}

export const FilterTransactions = ({
  onFilterApplied,
  onClearSearch,
}: FilterTransactionsProps) => {
  const { closeBottomSheet } = useBottomSheetContext();
  const { categories, fetchTransactions } = useTransactionContext();

  const [fromDate, setFromDate] = useState<Date | undefined>();
  const [toDate, setToDate] = useState<Date | undefined>();
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

  const handleClearFilters = async () => {
    setFromDate(undefined);
    setToDate(undefined);
    setSelectedCategories([]);
    setSelectedType(undefined);

    try {
      await fetchTransactions();
      onFilterApplied?.(false);
      onClearSearch?.(); // Limpar o campo de busca
      closeBottomSheet();
    } catch (error) {
      console.error("Erro ao limpar filtros:", error);
    }
  };

  const handleApplyFilters = async () => {
    const filters: TransactionFilters = {};
    let hasFilters = false;

    if (fromDate) {
      filters.from = fromDate;
      hasFilters = true;
    }

    if (toDate) {
      filters.to = toDate;
      hasFilters = true;
    }

    if (selectedCategories.length > 0) {
      filters.categoryIds = selectedCategories[0]; // Ajustar para suportar múltiplas categorias
      hasFilters = true;
    }

    if (selectedType) {
      filters.typeId = selectedType;
      hasFilters = true;
    }

    try {
      await fetchTransactions(hasFilters ? filters : undefined);
      onFilterApplied?.(hasFilters);
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
          Data
        </Text>
        <View className="flex-row gap-3">
          <DateInput label="De" value={fromDate} onChange={setFromDate} />
          <DateInput label="Até" value={toDate} onChange={setToDate} />
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
