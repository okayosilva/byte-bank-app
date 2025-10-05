import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

export type SnackbarMessageType = "ERROR" | "SUCCESS" | "INFO" | "WARNING";

interface SnackbarProps {
  message: string | null;
  type: SnackbarMessageType | null;
  open: boolean;
}

const getSnackbarStyles = (type: SnackbarMessageType) => {
  switch (type) {
    case "ERROR":
      return {
        container: "bg-red-50 border-red-500",
        text: "text-red-800",
        iconColor: "#dc2626",
      };
    case "SUCCESS":
      return {
        container: "bg-green-50 border-green-500",
        text: "text-green-800",
        iconColor: "#16a34a",
      };
    case "INFO":
      return {
        container: "bg-blue-50 border-blue-500",
        text: "text-blue-800",
        iconColor: "#2563eb",
      };
    case "WARNING":
      return {
        container: "bg-yellow-50 border-yellow-500",
        text: "text-yellow-800",
        iconColor: "#ca8a04",
      };
    default:
      return {
        container: "bg-gray-50 border-gray-500",
        text: "text-gray-800",
        iconColor: "#6b7280",
      };
  }
};

const getIcon = (type: SnackbarMessageType | null, iconColor: string) => {
  switch (type) {
    case "ERROR":
      return <Ionicons name="close-circle" size={20} color={iconColor} />;
    case "SUCCESS":
      return <Ionicons name="checkmark-circle" size={20} color={iconColor} />;
    case "INFO":
      return <Ionicons name="information-circle" size={20} color={iconColor} />;
    case "WARNING":
      return <Ionicons name="warning" size={20} color={iconColor} />;
    default:
      return null;
  }
};

export const Snackbar: React.FC<SnackbarProps> = ({ message, type, open }) => {
  if (!open || !message || !type) return null;

  const { container, text, iconColor } = getSnackbarStyles(type);

  return (
    <View
      className={`absolute bottom-8 left-1/2 -translate-x-1/2 min-w-[280px] max-w-[400px] border-2 rounded-lg px-5 py-3 flex-row items-center gap-3 z-50 font-medium text-base shadow-lg ${container} ${
        open ? "opacity-100" : "opacity-0"
      }`}
      accessibilityRole="alert"
      accessibilityLiveRegion="assertive"
    >
      <View>{getIcon(type, iconColor)}</View>
      <Text className={`flex-1 ${text}`}>{message}</Text>
    </View>
  );
};
