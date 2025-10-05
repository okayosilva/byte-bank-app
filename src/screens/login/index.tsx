import { View } from "react-native";

import { AuthHeader } from "@/components/authHeader";
import { DismissKeyboardView } from "@/components/dismissKeyboardView";
import { LoginForm } from "./loginForm";

export const Login = () => {
  return (
    <DismissKeyboardView>
      <View className="flex-1 w-[82%] self-center justify-center">
        <AuthHeader />
        <View className="gap-4">
          <LoginForm />
        </View>
      </View>
    </DismissKeyboardView>
  );
};
