import { colors } from "@/theme/colors";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ConfirmationModal } from "./confirmationModal";

interface ReceiptPickerProps {
  receiptUrl?: string;
  onReceiptSelected: (uri: string) => void;
  onReceiptRemoved: () => void;
}

export const ReceiptPicker = ({
  receiptUrl,
  onReceiptSelected,
  onReceiptRemoved,
}: ReceiptPickerProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Precisamos de permissão para acessar suas fotos!");
      return false;
    }
    return true;
  };

  const pickImage = async () => {
    try {
      setIsLoading(true);
      const hasPermission = await requestPermissions();
      if (!hasPermission) return;

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        onReceiptSelected(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Erro ao selecionar imagem:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao selecionar imagem";
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const takePhoto = async () => {
    try {
      setIsLoading(true);
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        alert("Precisamos de permissão para acessar a câmera!");
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        onReceiptSelected(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Erro ao tirar foto:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao tirar foto";
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveReceipt = () => {
    setShowRemoveModal(false);
    onReceiptRemoved();
  };

  if (receiptUrl) {
    return (
      <>
        <View className="w-full">
          <Text className="text-sm font-medium mb-2">Comprovante</Text>
          <View className="relative">
            <Image
              source={{ uri: receiptUrl }}
              className="w-full h-48 rounded-xl"
              resizeMode="cover"
            />
            <TouchableOpacity
              onPress={() => setShowRemoveModal(true)}
              className="absolute top-2 right-2 bg-red-500 rounded-full p-2"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 3,
                elevation: 5,
              }}
            >
              <MaterialIcons name="close" size={20} color={colors.white} />
            </TouchableOpacity>
          </View>

          <View className="flex-row gap-3 mt-3">
            <TouchableOpacity
              onPress={pickImage}
              className="flex-1 rounded-lg border border-gray-300 bg-white py-3 flex-row items-center justify-center gap-2"
            >
              <MaterialIcons
                name="photo-library"
                size={20}
                color={colors.gray[700]}
              />
              <Text className="text-gray-700 text-sm font-medium">
                Alterar da Galeria
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={takePhoto}
              className="flex-1 rounded-lg border border-gray-300 bg-white py-3 flex-row items-center justify-center gap-2"
            >
              <MaterialIcons
                name="camera-alt"
                size={20}
                color={colors.gray[700]}
              />
              <Text className="text-gray-700 text-sm font-medium">
                Nova Foto
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <ConfirmationModal
          visible={showRemoveModal}
          title="Remover comprovante"
          message="Tem certeza que deseja remover este comprovante?"
          confirmText="Remover"
          cancelText="Cancelar"
          iconName="delete"
          iconColor="#ef4444"
          confirmButtonColor="#ef4444"
          onConfirm={handleRemoveReceipt}
          onCancel={() => setShowRemoveModal(false)}
        />
      </>
    );
  }

  if (isLoading) {
    return (
      <View className="w-full">
        <Text className="text-sm font-medium mb-2">Comprovante</Text>
        <View className="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 h-32 items-center justify-center">
          <ActivityIndicator size="large" color={colors["accent-brand"]} />
          <Text className="text-gray-600 mt-2">Carregando...</Text>
        </View>
      </View>
    );
  }

  return (
    <View className="w-full">
      <Text className="text-sm font-medium mb-2">
        Comprovante <Text className="text-gray-500 text-xs">(opcional)</Text>
      </Text>
      <View className="flex-row gap-3 mt-2">
        <TouchableOpacity
          onPress={pickImage}
          className="flex-1 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 py-4 items-center justify-center"
        >
          <MaterialIcons
            name="photo-library"
            size={32}
            color={colors.gray[600]}
          />
          <Text className="text-gray-700 text-sm mt-2 font-medium">
            Galeria
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={takePhoto}
          className="flex-1 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 py-4 items-center justify-center"
        >
          <MaterialIcons name="camera-alt" size={32} color={colors.gray[600]} />
          <Text className="text-gray-700 text-sm mt-2 font-medium">Câmera</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
