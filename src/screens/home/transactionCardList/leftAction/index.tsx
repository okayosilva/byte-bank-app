import { useBottomSheetContext } from "@/context/bottomSheet.context";
import { colors } from "@/theme/colors";
import { Transaction } from "@/types/transactions";
import { MaterialIcons } from "@expo/vector-icons";
import { FC } from "react";
import { View } from "react-native";
import { Pressable } from "react-native-gesture-handler";
import { EditTransactionForm } from "./editTransactionForm";

type DataProps = {
  transaction: Transaction;
};

export const LeftAction: FC<DataProps> = ({ transaction }) => {
  const { openBottomSheet } = useBottomSheetContext();

  const handleOpenEditForm = () => {
    openBottomSheet(<EditTransactionForm transaction={transaction} />, 1);
  };

  return (
    <Pressable onPress={handleOpenEditForm}>
      <View className="bg-accent-brand w-[80] h-[80] items-center justify-center rounded-l-lg">
        <MaterialIcons name="edit" size={30} color={colors["white"]} />
      </View>
    </Pressable>
  );
};
