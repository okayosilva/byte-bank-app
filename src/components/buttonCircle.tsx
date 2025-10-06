import { colors } from "@/theme/colors";
import { MaterialIcons } from "@expo/vector-icons";
import clsx from "clsx";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";

export type ButtonCircleProps = TouchableOpacityProps & {
  iconName: keyof typeof MaterialIcons.glyphMap;
};

export const ButtonCircle = ({
  iconName,
  className,
  ...rest
}: ButtonCircleProps) => {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      className={clsx(
        "rounded-full  w-10 h-10 items-center justify-center",
        className
      )}
      {...rest}
    >
      <MaterialIcons name={iconName} size={24} color={colors.white} />
    </TouchableOpacity>
  );
};
