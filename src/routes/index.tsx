import { useAuthContext } from "@/context/auth.context";
import { NavigationContainer } from "@react-navigation/native";
import React, { useCallback } from "react";
import { SystemBars } from "react-native-edge-to-edge";
import { PrivateStack } from "./stack/privateStacks";
import { PublicStack } from "./stack/publicStacks";

const Router = () => {
  const { user, isLoading } = useAuthContext();

  const Routes = useCallback(() => {
    if (isLoading) {
      return <PublicStack />;
    }

    return !user ? <PublicStack /> : <PrivateStack />;
  }, [user, isLoading]);

  return (
    <NavigationContainer>
      <SystemBars style="dark" />
      <Routes />
    </NavigationContainer>
  );
};

export default Router;
