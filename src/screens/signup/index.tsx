import { AnimatedView } from "@/components/animatedView";
import { AuthHeader } from "@/components/authHeader";
import { DismissKeyboardView } from "@/components/dismissKeyboardView";
import { useAnimatedView } from "@/utils/hooks/useAnimatedView";
import React, { useEffect } from "react";
import { View } from "react-native";
import { SignupForm } from "./signupForm";

export const Signup = () => {
  const { fadeOut, fadeIn, fadeAnim } = useAnimatedView();

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
          <SignupForm onNavigateBack={fadeOut} />
        </View>
      </AnimatedView>
    </DismissKeyboardView>
  );
};
