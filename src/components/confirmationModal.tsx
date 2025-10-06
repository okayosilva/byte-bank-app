import { colors } from "@/theme/colors";
import { MaterialIcons } from "@expo/vector-icons";
import {
  Modal,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

interface ConfirmationModalProps {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  iconName?: keyof typeof MaterialIcons.glyphMap;
  iconColor?: string;
  confirmButtonColor?: string;
}

export const ConfirmationModal = ({
  visible,
  title,
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  onConfirm,
  onCancel,
  iconName = "help-outline",
  iconColor = colors["accent-brand"],
  confirmButtonColor = colors["accent-red"],
}: ConfirmationModalProps) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <TouchableWithoutFeedback onPress={onCancel}>
        <View className="flex-1 justify-center items-center bg-black/50 px-6">
          <TouchableWithoutFeedback>
            <View className="bg-white rounded-2xl p-6 w-full max-w-[400px]">
              <View className="items-center mb-4">
                <View
                  className="w-16 h-16 rounded-full items-center justify-center mb-4"
                  style={{ backgroundColor: `${iconColor}20` }}
                >
                  <MaterialIcons name={iconName} size={32} color={iconColor} />
                </View>
                <Text className="text-xl font-bold text-background-secondary text-center">
                  {title}
                </Text>
              </View>

              <Text className="text-gray-800 text-center text-base mb-6">
                {message}
              </Text>

              <View className="flex-row gap-3">
                <TouchableOpacity
                  onPress={onCancel}
                  className="flex-1 py-3 px-4 rounded-xl border-2 border-gray-500"
                >
                  <Text className="text-gray-700 transparent font-semibold text-center">
                    {cancelText}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={onConfirm}
                  className="flex-1 py-3 px-4 rounded-xl"
                  style={{
                    backgroundColor: confirmButtonColor,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.2,
                    shadowRadius: 3,
                    elevation: 3,
                  }}
                >
                  <Text className="text-white font-semibold text-center">
                    {confirmText}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
