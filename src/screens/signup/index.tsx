import { AuthHeader } from "@/components/authHeader";
import { DismissKeyboardView } from "@/components/dismissKeyboardView";
import React from "react";
import { View } from "react-native";
import { SignupForm } from "./signupForm";

export const Signup = () => {
  return (
    <DismissKeyboardView>
      <View className="flex-1 w-[82%] self-center justify-center">
        <AuthHeader />
        <View className="gap-4">
          <SignupForm />
        </View>
      </View>
    </DismissKeyboardView>
  );
};
