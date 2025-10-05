import { Home } from "@/screens/home";
import { createStackNavigator } from "@react-navigation/stack";

export type PrivateStackParamList = {
  home: undefined;
};

export const PrivateStack = () => {
  const Stack = createStackNavigator<PrivateStackParamList>();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="home" component={Home} />
    </Stack.Navigator>
  );
};
