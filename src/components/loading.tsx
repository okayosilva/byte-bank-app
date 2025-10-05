import { ActivityIndicator, Text, View } from "react-native";

interface LoadingProps {
  message?: string;
}

export const Loading = ({ message = "Carregando..." }: LoadingProps) => {
  return (
    <View className="flex-1 justify-center items-center bg-white">
      <View className="items-center">
        <ActivityIndicator size="large" color="#ef4444" />
        <Text className="mt-4 text-lg font-medium text-gray-700">
          {message}
        </Text>
        <Text className="mt-2 text-sm text-gray-500">Bytebank</Text>
      </View>
    </View>
  );
};
