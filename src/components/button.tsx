import clsx from "clsx";
import { Text, TouchableOpacity, TouchableOpacityProps } from "react-native";

type ButtonProps = TouchableOpacityProps & {
  children: React.ReactNode;
};

export const Button = ({ children, className, ...rest }: ButtonProps) => {
  return (
    <TouchableOpacity
      className={clsx(
        "bg-accent-brand-background-primary rounded-lg h-button w-full flex-row items-center justify-center",
        className
      )}
      {...rest}
    >
      <Text className="text-white font-medium text-sm">{children}</Text>
    </TouchableOpacity>
  );
};
