import { Text } from "react-native";

export const ErrorMessage = ({ error }: { error: string }) => {
  return (
    <Text className="text-red-500 mt-2 text-sm">{error}</Text>
    );
};
