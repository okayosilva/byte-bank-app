import { createStackNavigator } from "@react-navigation/stack";

import { LoadingScreen } from "@/screens/loading";
import { Login } from "@/screens/login";
import { Onboarding } from "@/screens/onboarding";
import { Signup } from "@/screens/signup";
import { useOnboarding } from "@/utils/hooks/useOnboarding";

export type PublicStackParamList = {
  onboarding: undefined;
  login: undefined;
  signup: undefined;
};

const Stack = createStackNavigator<PublicStackParamList>();

export const PublicStack = () => {
  const { hasSeenOnboarding, isLoading } = useOnboarding();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={hasSeenOnboarding ? "login" : "onboarding"}
    >
      <Stack.Screen name="onboarding" component={Onboarding} />
      <Stack.Screen name="login" component={Login} />
      <Stack.Screen name="signup" component={Signup} />
    </Stack.Navigator>
  );
};
