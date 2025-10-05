import { useBottomSheetContext } from "@/context/bottomSheet.context";
import { colors } from "@/theme/colors";
import { MaterialIcons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
import { ButtonIconSelect } from "./buttonIconSelect";
import { NewTransaction } from "./newTransaction";

export const SelectTransaction = () => {
  const { closeBottomSheet, openBottomSheet } = useBottomSheetContext();

  const handleTransactionType = (type: "income" | "expense") => {
    openBottomSheet(<NewTransaction transactionType={type} />, 1);
  };

  return (
    <View>
      <View className=" p-6 ">
        <View className="flex-row items-center justify-between">
          <Text className="text-slate-900 text-base font-bold">
            Entradas e saídas
          </Text>
          <TouchableOpacity onPress={() => closeBottomSheet()}>
            <MaterialIcons name="close" size={24} color={colors.gray[700]} />
          </TouchableOpacity>
        </View>
        <View className=" mt-4 border-b-2 border-gray-400"></View>
      </View>

      <View className="px-6 gap-2">
        <ButtonIconSelect
          title="Entrada"
          icon="trending-up"
          colors={{
            background: "bg-accent-brand/10",
            icon: colors["accent-brand-light"],
          }}
          onPress={() => handleTransactionType("income")}
        />
        <ButtonIconSelect
          title="Saída"
          icon="trending-down"
          colors={{
            background: "bg-accent-red/10",
            icon: colors["accent-red"],
          }}
          onPress={() => handleTransactionType("expense")}
        />
      </View>
    </View>
  );
};
