import { useKeyboardVisible } from "@/utils/hooks/useKeyboardVisible";
import { useRoute } from "@react-navigation/native";
import { Image, View } from "react-native";

export const AuthHeader = () => {
  const isKeyboardVisible = useKeyboardVisible();
  const route = useRoute();

  if (isKeyboardVisible && route.name === "signup") return <></>;

  return (
    <View className="mb-10 justify-center items-center">
      <Image
        source={require("@/assets/logo.png")}
        className="w-[215px] h-[63px]"
      />
    </View>
  );
};
