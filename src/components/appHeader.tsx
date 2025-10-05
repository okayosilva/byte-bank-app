import { Image, Text, View } from "react-native";

import { useAuthContext } from "@/context/auth.context";
import { ButtonCircle } from "./buttonCircle";

export const AppHeader = () => {
  const { user, handleLogout } = useAuthContext();

  return (
    <View className="px-6 pt-6 ">
      <View className="flex-row items-center justify-between">
        <Image
          source={require("@/assets/logo.png")}
          className="w-[148px] h-[33px]"
        />

        <ButtonCircle iconName="add" />
      </View>

      <View className="mt-4">
        <Text className="text-gray-800 text-base font-medium">
          Olá, {user?.user_metadata.name}
        </Text>

        <View className="mt-2">
          <Text className="text-background-tertiary text-3xl font-bold">
            R$ 1.000.000.000,00
          </Text>
          <Text className="text-gray-800 text-base font-regular mt-1">
            Seu saldo atual
          </Text>
        </View>
      </View>
    </View>
  );
};
