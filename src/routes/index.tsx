import { Snackbar } from "@/components/snackBar";
import { useAuthContext } from "@/context/auth.context";
import { useSnackbarContext } from "@/context/snackbar.context";
import { LoadingScreen } from "@/screens/loading";
import { NavigationContainer } from "@react-navigation/native";
import React, { useCallback } from "react";
import { SystemBars } from "react-native-edge-to-edge";
import { PrivateStack } from "./stack/privateStacks";
import { PublicStack } from "./stack/publicStacks";

const Router = () => {
  const { user, isLoading } = useAuthContext();
  const { message, type } = useSnackbarContext();

  const Routes = useCallback(() => {
    if (isLoading) {
      return <LoadingScreen />;
    }

    return !user ? <PublicStack /> : <PrivateStack />;
  }, [user, isLoading]);

  return (
    <NavigationContainer>
      <SystemBars style="dark" />
      <Routes />
      <Snackbar message={message} type={type} open={!!message} />
    </NavigationContainer>
  );
};

export default Router;
