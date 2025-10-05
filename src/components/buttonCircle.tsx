import { colors } from "@/theme/colors";
import { MaterialIcons } from "@expo/vector-icons";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";

export type ButtonCircleProps = TouchableOpacityProps & {
  iconName: keyof typeof MaterialIcons.glyphMap;
};

export const ButtonCircle = ({ iconName, ...rest }: ButtonCircleProps) => {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      className="bg-accent-brand-background-primary rounded-full  w-10 h-10 items-center justify-center"
      {...rest}
    >
      <MaterialIcons name={iconName} size={24} color={colors.white} />
    </TouchableOpacity>
  );
};
