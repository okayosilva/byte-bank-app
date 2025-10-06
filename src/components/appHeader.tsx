import { Image, Text, View } from "react-native";

import { useAuthContext } from "@/context/auth.context";
import { useBottomSheetContext } from "@/context/bottomSheet.context";
import { ButtonCircle } from "./buttonCircle";
import { SelectTransaction } from "./transactions/selectTransaction";

export const AppHeader = ({amount}: {amount: number}) => {
  const { user, handleLogout } = useAuthContext();
  const { openBottomSheet } = useBottomSheetContext();

  return (
    <View className="px-6 pt-6 ">
      <View className="flex-row items-center justify-between">
        <Image
          source={require("@/assets/logo.png")}
          className="w-[148px] h-[33px]"
        />

        <ButtonCircle
          iconName="add"
          onPress={() => openBottomSheet(<SelectTransaction />, 0)}
        />
      </View>

      <View className="mt-4">
        <Text className="text-gray-800 text-base font-medium">
          Olá, {user?.user_metadata.name}
        </Text>

        <View className="mt-3">
          <Text className="text-background-tertiary text-3xl font-bold">
            R$ {amount.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </Text>
          <Text className="text-gray-800 text-sm font-regular ">
            Seu saldo atual
          </Text>
        </View>
      </View>
    </View>
  );
};
