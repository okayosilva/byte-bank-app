import {
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from "react-native";

import { colors as themeColors } from "@/theme/colors";
import { MaterialIcons } from "@expo/vector-icons";
import clsx from "clsx";

type ButtonIconSelectProps = TouchableOpacityProps & {
  title: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  colors: {
    background: string;
    icon: string;
  };
};

export const ButtonIconSelect = ({
  title,
  icon,
  colors,
  ...rest
}: ButtonIconSelectProps) => {
  return (
    <TouchableOpacity
      className="flex-row items-center py-2 justify-between"
      {...rest}
    >
      <View className="flex-row items-center gap-4">
        <View
          className={clsx(
            "w-10 h-10  bg-opacity-30 rounded-full items-center justify-center ",
            colors.background
          )}
        >
          <MaterialIcons name={icon} size={24} color={colors.icon} />
        </View>
        <Text className="text-slate-900 text-base font-regular">{title}</Text>
      </View>

      <MaterialIcons
        name="chevron-right"
        size={24}
        color={themeColors.gray[700]}
      />
    </TouchableOpacity>
  );
};
