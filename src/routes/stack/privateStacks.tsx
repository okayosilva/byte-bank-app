import { Dashboard } from "@/screens/dashboard";
import { Home } from "@/screens/home";
import { colors } from "@/theme/colors";
import { MaterialIcons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Platform, View } from "react-native";

export type PrivateStackParamList = {
  home: undefined;
  dashboard: undefined;
};

export const PrivateStack = () => {
  const Tab = createBottomTabNavigator<PrivateStackParamList>();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors["accent-brand-background-primary"],
        tabBarInactiveTintColor: colors.gray[600],
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopWidth: 0,
          paddingBottom: Platform.OS === "ios" ? 20 : 8,
          paddingTop: 8,
          height: Platform.OS === "ios" ? 85 : 65,
          elevation: 10,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: -2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          position: "absolute",
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          marginTop: 4,
        },
        tabBarItemStyle: {
          paddingVertical: 4,
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
      }}
    >
      <Tab.Screen
        name="home"
        component={Home}
        options={{
          tabBarLabel: "",
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                width: 50,
                height: 32,
                borderRadius: 16,
                marginBottom: 18,
                backgroundColor: focused
                  ? `${colors["accent-brand-background-primary"]}15`
                  : "transparent",
              }}
            >
              <MaterialIcons
                name="receipt-long"
                size={focused ? 26 : 24}
                color={color}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="dashboard"
        component={Dashboard}
        options={{
          tabBarLabel: "",
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                width: 50,
                height: 32,
                borderRadius: 16,
                marginBottom: 18,
                backgroundColor: focused
                  ? `${colors["accent-brand-background-primary"]}15`
                  : "transparent",
              }}
            >
              <MaterialIcons
                name="assessment"
                size={focused ? 26 : 24}
                color={color}
              />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};
