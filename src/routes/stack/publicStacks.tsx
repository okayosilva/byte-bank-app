import { createStackNavigator } from "@react-navigation/stack";

import { Login } from "@/screens/login";
import { Signup } from "@/screens/signup";

export type PublicStackParamList = {
  login: undefined;
  signup: undefined;
};

const Stack = createStackNavigator<PublicStackParamList>();

export const PublicStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" component={Login} />
      <Stack.Screen name="signup" component={Signup} />
    </Stack.Navigator>
  );
};
