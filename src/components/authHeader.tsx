import { useKeyboardVisible } from "@/utils/hooks/useKeyboardVisible";
import { useRoute } from "@react-navigation/native";
import { Image, Text, View } from "react-native";

export const AuthHeader = () => {
  const isKeyboardVisible = useKeyboardVisible();
  const route = useRoute();

  if (isKeyboardVisible && route.name === "signup") return <></>;

  return (
    <View className="mb-10 justify-center items-center">
      {route.name === "login" && (
        <Text className="text-base font-medium text-gray-800">
          Entre na sua conta
        </Text>
      )}
      <Image
        source={require("@/assets/logo.png")}
        className="w-[215px] h-[63px]"
      />

      {route.name === "signup" && (
        <Text className="text-base font-medium text-gray-800">Crie sua conta</Text>
      )}
    </View>
  );
};
