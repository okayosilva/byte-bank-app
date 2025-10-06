import { colors } from "@/theme/colors";
import { MaterialIcons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  Modal,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

type DeleteModalProps = {
  modalVisible: boolean;
  hideModal: () => void;
  handleDeleteTransaction: () => void;
  loading?: boolean;
};

export const DeleteModal = ({
  modalVisible,
  hideModal,
  handleDeleteTransaction,
  loading = false,
}: DeleteModalProps) => {
  return (
    <View className="flex-1 absolute">
      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={hideModal}
      >
        <TouchableWithoutFeedback onPress={hideModal}>
          <View className="flex-1 items-center justify-center bg-background-secondary/50">
            <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
              <View className="m-5 bg-background-primary rounded-[16] p-8 items-center shadow-lg w-[90%] h-[322] z-9">
                <View className="w-full flex-row justify-between items-center border-b border-gray-300 pb-6">
                  <View className="flex-row gap-6 items-center">
                    <Text className="text-gray-800 text-lg font-bold">
                      Apagar transação?
                    </Text>
                  </View>

                  <TouchableOpacity onPress={hideModal}>
                    <MaterialIcons
                      name="close"
                      color={colors.gray[700]}
                      size={25}
                    />
                  </TouchableOpacity>
                </View>

                <View className="flex-1 my-6">
                  <Text className="text-gray-800 text-lg leading-8">
                    Tem certeza que deseja apagar essa transação? Esta ação não
                    pode ser desfeita
                  </Text>
                </View>

                <View className="flex-row justify-end gap-4 w-full p-6 pb-0 pr-0">
                  <TouchableOpacity
                    className="w-[100] bg-none border-2 border-accent-brand-background-primary items-center justify-center p-3 rounded-md"
                    onPress={hideModal}
                    disabled={loading}
                  >
                    <Text className="text-accent-brand-background-primary">
                      Cancelar
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="w-[100] bg-accent-red items-center justify-center p-3 rounded-md"
                    onPress={handleDeleteTransaction}
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator size="small" color={colors.white} />
                    ) : (
                      <Text className="text-white">Apagar</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};
