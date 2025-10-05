import { View } from "react-native";

import { AnimatedView } from "@/components/animatedView";
import { AuthHeader } from "@/components/authHeader";
import { DismissKeyboardView } from "@/components/dismissKeyboardView";
import { useAnimatedView } from "@/utils/hooks/useAnimatedView";
import { useEffect } from "react";
import { LoginForm } from "./loginForm";

export const Login = () => {
  const { fadeAnim, fadeIn } = useAnimatedView();

  useEffect(() => {
    fadeIn();
  }, []);

  return (
    <DismissKeyboardView>
      <AnimatedView
        fadeAnim={fadeAnim}
        className="flex-1 w-[82%] self-center justify-center"
      >
        <AuthHeader />
        <View className="gap-4">
          <LoginForm />
        </View>
      </AnimatedView>
    </DismissKeyboardView>
  );
};
