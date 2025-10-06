import { Image, Text, View } from "react-native";

import { useAuthContext } from "@/context/auth.context";
import { useBottomSheetContext } from "@/context/bottomSheet.context";
import { useState } from "react";
import { ButtonCircle } from "./buttonCircle";
import { ConfirmationModal } from "./confirmationModal";
import { SelectTransaction } from "./transactions/selectTransaction";

export const AppHeader = ({ amount }: { amount: number }) => {
  const { user, handleLogout } = useAuthContext();
  const { openBottomSheet } = useBottomSheetContext();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogoutConfirm = async () => {
    setShowLogoutModal(false);
    await handleLogout();
  };

  return (
    <View className="px-6 pt-6 ">
      <View className="flex-row items-center justify-between">
        <Image
          source={require("@/assets/logo.png")}
          className="w-[148px] h-[33px]"
        />

        <View className="flex-row items-center gap-4">
          <ButtonCircle
            iconName="logout"
            className="bg-gray-600"
            onPress={() => setShowLogoutModal(true)}
          />
          <ButtonCircle
            iconName="add"
            className="bg-accent-brand-background-primary"
            onPress={() => openBottomSheet(<SelectTransaction />, 0)}
          />
        </View>
      </View>

      <ConfirmationModal
        visible={showLogoutModal}
        title="Sair da conta"
        message="Tem certeza que deseja sair? Você precisará fazer login novamente para acessar sua conta."
        confirmText="Sair"
        cancelText="Cancelar"
        iconName="logout"
        iconColor="#6b7280"
        confirmButtonColor="#ef4444"
        onConfirm={handleLogoutConfirm}
        onCancel={() => setShowLogoutModal(false)}
      />

      <View className="mt-4">
        <Text className="text-gray-800 text-base font-medium">
          Olá, {user?.user_metadata.name}
        </Text>

        <View className="mt-3">
          <Text className="text-background-tertiary text-3xl font-bold">
            {amount.toLocaleString("pt-BR", {
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
