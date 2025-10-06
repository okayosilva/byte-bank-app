import { colors } from "@/theme/colors";
import { MaterialIcons } from "@expo/vector-icons";
import { FC } from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";

type SelectTypeModalProps = {
  visible: boolean;
  onClose: () => void;
  selectedTypeId: number;
  onSelectType: (typeId: number) => void;
};

export const SelectTypeModal: FC<SelectTypeModalProps> = ({
  visible,
  onClose,
  selectedTypeId,
  onSelectType,
}) => {
  const handleSelectType = (typeId: number) => {
    onSelectType(typeId);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPress={onClose}
        className="flex-1 bg-black/50 justify-center items-center"
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl w-[90%] max-w-md overflow-hidden"
        >
          <View className="p-6">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-slate-900 text-lg font-bold">
                Selecione o tipo
              </Text>
              <TouchableOpacity onPress={onClose}>
                <MaterialIcons
                  name="close"
                  size={24}
                  color={colors.gray[700]}
                />
              </TouchableOpacity>
            </View>

            <View className="gap-2">
              <TouchableOpacity
                onPress={() => handleSelectType(1)}
                className="flex-row items-center py-3 px-4 rounded-lg border border-gray-200"
                style={{
                  backgroundColor:
                    selectedTypeId === 1
                      ? colors["accent-brand-light"] + "20"
                      : "white",
                }}
              >
                <View className="flex-row items-center gap-3 flex-1">
                  <View
                    className="w-10 h-10 rounded-full items-center justify-center"
                    style={{
                      backgroundColor: colors["accent-brand-light"] + "20",
                    }}
                  >
                    <MaterialIcons
                      name="trending-up"
                      size={24}
                      color={colors["accent-brand-light"]}
                    />
                  </View>
                  <Text className="text-slate-900 text-base font-medium">
                    Entrada
                  </Text>
                </View>
                {selectedTypeId === 1 && (
                  <MaterialIcons
                    name="check"
                    size={24}
                    color={colors["accent-brand-light"]}
                  />
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleSelectType(2)}
                className="flex-row items-center py-3 px-4 rounded-lg border border-gray-200"
                style={{
                  backgroundColor:
                    selectedTypeId === 2
                      ? colors["accent-red"] + "20"
                      : "white",
                }}
              >
                <View className="flex-row items-center gap-3 flex-1">
                  <View
                    className="w-10 h-10 rounded-full items-center justify-center"
                    style={{ backgroundColor: colors["accent-red"] + "20" }}
                  >
                    <MaterialIcons
                      name="trending-down"
                      size={24}
                      color={colors["accent-red"]}
                    />
                  </View>
                  <Text className="text-slate-900 text-base font-medium">
                    Saída
                  </Text>
                </View>
                {selectedTypeId === 2 && (
                  <MaterialIcons
                    name="check"
                    size={24}
                    color={colors["accent-red"]}
                  />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};
