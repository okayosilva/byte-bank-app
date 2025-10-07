import { ONBOARDING_STORAGE_KEY } from "@/utils/constants/onboarding";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

export const useOnboarding = () => {
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState<boolean | null>(
    null
  );

  useEffect(() => {
    checkOnboarding();
  }, []);

  const checkOnboarding = async () => {
    try {
      const value = await AsyncStorage.getItem(ONBOARDING_STORAGE_KEY);
      setHasSeenOnboarding(value === "true");
    } catch (error) {
      console.error("Erro ao verificar onboarding:", error);
      setHasSeenOnboarding(false);
    }
  };

  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_STORAGE_KEY, "true");
      setHasSeenOnboarding(true);
    } catch (error) {
      console.error("Erro ao salvar onboarding:", error);
    }
  };

  const resetOnboarding = async () => {
    try {
      await AsyncStorage.removeItem(ONBOARDING_STORAGE_KEY);
      setHasSeenOnboarding(false);
    } catch (error) {
      console.error("Erro ao resetar onboarding:", error);
    }
  };

  return {
    hasSeenOnboarding,
    completeOnboarding,
    resetOnboarding,
    isLoading: hasSeenOnboarding === null,
  };
};
