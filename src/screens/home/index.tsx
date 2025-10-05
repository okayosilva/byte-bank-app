import { useAuthContext } from "@/context/auth.context";
import { Text, TouchableOpacity, View } from "react-native";

export const Home = () => {
  const { user, handleLogout } = useAuthContext();

  const handleLogoutPress = async () => {
    try {
      await handleLogout();
    } catch (error) {
      console.error("Erro no logout:", error);
    }
  };

  return (
    <View className="flex-1 justify-center items-center px-6 bg-white">
      <View className="w-full max-w-sm">
        <Text className="text-2xl font-bold text-center mb-6 text-gray-800">
          Bem-vindo ao Bytebank!
        </Text>

        <View className="bg-gray-50 rounded-lg p-4 mb-6">
          <Text className="text-lg font-semibold text-gray-700 mb-2">
            Informações da conta:
          </Text>
          <Text className="text-gray-600 mb-1">Email: {user?.email}</Text>
          <Text className="text-gray-600 mb-1">
            Nome: {user?.user_metadata?.name || "Não informado"}
          </Text>
          <Text className="text-gray-600">ID: {user?.id}</Text>
        </View>

        <TouchableOpacity
          onPress={handleLogoutPress}
          className="bg-red-500 rounded-lg py-3 px-6"
        >
          <Text className="text-white text-center font-semibold">
            Sair da conta
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
