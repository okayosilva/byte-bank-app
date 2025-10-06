import { AnimatedView } from "@/components/animatedView";
import { AppHeader } from "@/components/appHeader";
import { useAuthContext } from "@/context/auth.context";
import { useSnackbarContext } from "@/context/snackbar.context";
import { useTransactionContext } from "@/context/transaction.context";
import { useAnimatedView } from "@/utils/hooks/useAnimatedView";
import { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export const Home = () => {
  const { fadeAnim, fadeIn } = useAnimatedView();
  const { fetchCategories } = useTransactionContext();

  useEffect(() => {
    fadeIn();
  }, []);

  const { user, handleLogout } = useAuthContext();
  const { notify } = useSnackbarContext();

  const handleLogoutPress = async () => {
    try {
      await handleLogout();
      notify({
        message: "Logout realizado com sucesso!",
        type: "SUCCESS",
      });
    } catch (error) {
      console.error("Erro no logout:", error);
      notify({
        message: "Erro ao fazer logout",
        type: "ERROR",
      });
    }
  };

  const handleFetchCategories = async () => {
    try {
      await fetchCategories();
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
      notify({
        message: "Erro ao buscar categorias",
        type: "ERROR",
      });
    }
  };

  useEffect(() => {
    (async () => {
      await handleFetchCategories();
    })();
  }, []);

  return (
    <SafeAreaView className="flex-1 ">
      <AnimatedView fadeAnim={fadeAnim}>
        <AppHeader />
      </AnimatedView>
    </SafeAreaView>
  );
};
