import { NavigationContainer } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import { SystemBars } from "react-native-edge-to-edge";
import { PrivateStack } from "./stack/privateStacks";
import { PublicStack } from "./stack/publicStacks";

const Router = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(undefined);

  const Routes = useCallback(() => {
    return !isAuthenticated ? <PublicStack /> : <PrivateStack />;
  }, [isAuthenticated]);

  return (
    <NavigationContainer>
      <SystemBars style="dark" />
      <Routes />
    </NavigationContainer>
  );
};

export default Router;
