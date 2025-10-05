import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

export type SnackbarMessageType = "ERROR" | "SUCCESS" | "INFO" | "WARNING";

interface SnackbarProps {
  message: string | null;
  type: SnackbarMessageType | null;
  open: boolean;
}

const getSnackbarStyles = () => ({
  container: "bg-white border border-gray-200",
  text: "text-gray-700",
  iconColor: "#6b7280",
});

const getIcon = (type: SnackbarMessageType | null, iconColor: string) => {
  const iconMap = {
    ERROR: "alert-circle",
    SUCCESS: "checkmark-circle",
    INFO: "information-circle",
    WARNING: "warning",
  } as const;

  const iconName = iconMap[type as keyof typeof iconMap];
  return iconName ? (
    <Ionicons name={iconName} size={20} color={iconColor} />
  ) : null;
};

export const Snackbar: React.FC<SnackbarProps> = ({ message, type, open }) => {
  if (!open || !message || !type) return null;

  const { container, text, iconColor } = getSnackbarStyles();

  return (
    <View
      className={`absolute bottom-16 left-1/2 -translate-x-1/2 w-80 max-w-[90%] rounded-lg px-3 py-2 flex-row items-center gap-2 z-50  shadow-sm ${container} ${
        open ? "opacity-100" : "opacity-0"
      }`}
      accessibilityRole="alert"
      accessibilityLiveRegion="assertive"
    >
      <View className="flex-shrink-0">{getIcon(type, iconColor)}</View>
      <Text className={`flex-1 text-sm font-medium ${text}`} numberOfLines={2}>
        {message}
      </Text>
    </View>
  );
};
