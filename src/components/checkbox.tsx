import { colors } from "@/theme/colors";
import Checkbox from "expo-checkbox";
import { Text, TouchableOpacity, View } from "react-native";

interface CheckboxProps {
  label: string;
  checked: boolean;
  onPress: () => void;
}

export const CheckboxComponent = ({
  label,
  checked,
  onPress,
}: CheckboxProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center py-3"
      activeOpacity={0.7}
    >
      <View className="mr-3">
        <Checkbox
          value={checked}
          onValueChange={onPress}
          color={
            checked ? colors["accent-brand-background-primary"] : undefined
          }
        />
      </View>
      <Text
        className="text-base"
        style={{ color: colors["background-secondary"] }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};
