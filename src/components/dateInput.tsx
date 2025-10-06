import { colors } from "@/theme/colors";
import { MaterialIcons } from "@expo/vector-icons";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useState } from "react";
import { Platform, Text, TouchableOpacity, View } from "react-native";

interface DateInputProps {
  label: string;
  value?: Date;
  onChange: (date?: Date) => void;
}

export const DateInput = ({ label, value, onChange }: DateInputProps) => {
  const [show, setShow] = useState(false);

  const handleChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShow(false);
    }

    if (event.type === "set" && selectedDate) {
      onChange(selectedDate);
    } else if (event.type === "dismissed") {
      setShow(false);
    }
  };

  const formatDate = (date?: Date) => {
    if (!date) return "";
    return date.toLocaleDateString("pt-BR");
  };

  return (
    <View className="flex-1">
      <TouchableOpacity
        onPress={() => setShow(true)}
        className="border rounded-lg h-12 px-3 flex-row items-center justify-between"
        style={{
          borderColor: colors["border-input"],
          backgroundColor: colors.white,
        }}
        activeOpacity={0.7}
      >
        <Text
          className="text-sm"
          style={{
            color: value ? colors["background-secondary"] : colors.gray[600],
          }}
        >
          {formatDate(value) || label}
        </Text>
        <MaterialIcons
          name="calendar-today"
          size={18}
          color={colors.gray[600]}
        />
      </TouchableOpacity>

      {show && (
        <DateTimePicker
          value={value || new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleChange}
          maximumDate={new Date()}
        />
      )}
    </View>
  );
};
