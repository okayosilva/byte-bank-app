import clsx from "clsx";

import { colors } from "@/theme/colors";
import { useRef, useState } from "react";

import { MaterialIcons } from "@expo/vector-icons";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { Text, TextInputProps, TouchableOpacity, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";

type InputProps<T extends FieldValues> = TextInputProps & {
  control: Control<T>;
  name: Path<T>;
  label?: string;
};

export const Input = <T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  secureTextEntry,
  ...rest
}: InputProps<T>) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(secureTextEntry);

  const inputRef = useRef<TextInput>(null);

  const handleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleFocus = () => {
    if (inputRef.current) {
      setIsFocused(inputRef.current.isFocused());
    }
  };

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => (
        <View className="w-full">
          {label && (
            <Text
              className={clsx(
                "mb-2 text-sm font-medium",
                isFocused
                  ? "text-accent-brand-background-primary"
                  : "text-background-secondary"
              )}
            >
              {label}
            </Text>
          )}
          <TouchableOpacity
            activeOpacity={0.9}
            className={clsx(
              "rounded-lg border w-full bg-white flex-row items-center justify-between px-3  h-12",
              isFocused
                ? "border-accent-brand-background-primary"
                : "border-border-input"
            )}
          >
            <TextInput
              ref={inputRef}
              value={value}
              onChangeText={onChange}
              placeholder={placeholder}
              onFocus={handleFocus}
              onEndEditing={handleFocus}
              placeholderTextColor={colors.gray[600]}
              className="rounded-lg text-base h-full flex-1 text-background-secondary"
              secureTextEntry={showPassword}
              {...rest}
            />
            {secureTextEntry && (
              <TouchableOpacity onPress={handleShowPassword}>
                <MaterialIcons
                  name={showPassword ? "visibility" : "visibility-off"}
                  size={24}
                  color={colors.gray[600]}
                />
              </TouchableOpacity>
            )}
          </TouchableOpacity>
        </View>
      )}
    />
  );
};
