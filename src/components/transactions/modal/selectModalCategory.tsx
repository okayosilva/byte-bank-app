import { useTransactionContext } from "@/context/transaction.context";
import { colors } from "@/theme/colors";
import { MaterialIcons } from "@expo/vector-icons";
import clsx from "clsx";
import Checkbox from "expo-checkbox";
import { FC, useMemo, useState } from "react";
import {
  FlatList,
  Modal,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

type SelectModalCategoryProps = {
  selectedCategoryId: number;
  onSelectCategory: (categoryId: number) => void;
};

export const SelectModalCategory: FC<SelectModalCategoryProps> = ({
  selectedCategoryId,
  onSelectCategory,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { categories } = useTransactionContext();

  const handleModalPress = () => {
    setIsModalVisible((prev) => !prev);
  };

  const selected = useMemo(() => {
    return categories.find((category) => category.id === selectedCategoryId);
  }, [categories, selectedCategoryId]);

  const handleSelectCategory = (categoryId: number) => {
    onSelectCategory(categoryId);
    setIsModalVisible(false);
  };

  return (
    <View className="w-full">
      <Text className="text-sm font-medium mb-2">Selecione uma categoria</Text>
      <TouchableOpacity activeOpacity={0.7} onPress={handleModalPress}>
        <View className="rounded-lg border w-full bg-white flex-row items-center justify-between px-3 border-border-input h-12">
          <Text>{selected?.name || "Selecione uma categoria"}</Text>
        </View>
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={handleModalPress}>
          <View className="flex-1 bg-black/40 items-center justify-center">
            <View className="w-[90%] bg-white p-4 rounded-2xl">
              <View className="">
                <View className="flex-row items-center justify-between ">
                  <Text className="text-lg font-bold text-gray-800">
                    Selecione uma categoria
                  </Text>
                  <TouchableOpacity onPress={handleModalPress}>
                    <MaterialIcons
                      name="close"
                      size={24}
                      color={colors.gray[800]}
                    />
                  </TouchableOpacity>
                </View>

                <View className="border-b border-gray-200 my-4"></View>
              </View>

              <FlatList
                keyExtractor={(item) => `category-${item.id}`}
                data={categories}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => {
                      handleSelectCategory(item.id);
                    }}
                    className={clsx(
                      "flex-row items-center gap-2 border border-gray-200 rounded-lg p-2 my-2 h-12",
                      selected?.id === item.id &&
                        "bg-accent-brand-background-primary "
                    )}
                  >
                    <Checkbox
                      value={selected?.id === item.id}
                      onValueChange={() => {
                        handleSelectCategory(item.id);
                      }}
                    />
                    <Text
                      className={clsx(
                        "text-gray-800 text-base font-medium",
                        selected?.id === item.id && "text-white"
                      )}
                    >
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};
