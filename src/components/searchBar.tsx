import { colors } from "@/theme/colors";
import { MaterialIcons } from "@expo/vector-icons";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onFilterPress: () => void;
  onSearchPress: () => void;
  filterActive?: boolean;
}

export const SearchBar = ({
  value,
  onChangeText,
  onFilterPress,
  onSearchPress,
  filterActive = false,
}: SearchBarProps) => {
  return (
    <View className="px-6 mb-6">
      <View className="flex-row items-center gap-3">
        {/* Search Input */}
        <View
          className="flex-1 h-12 rounded-lg flex-row items-center px-3 gap-2 border"
          style={{
            backgroundColor: colors.white,
            borderColor: colors["border-input"],
          }}
        >
          <MaterialIcons name="search" size={20} color={colors.gray[600]} />
          <TextInput
            value={value}
            onChangeText={onChangeText}
            placeholder="Busque uma transação"
            placeholderTextColor={colors.gray[600]}
            className="flex-1 text-base"
            style={{ color: colors["background-secondary"] }}
            returnKeyType="search"
            onSubmitEditing={onSearchPress}
          />
        </View>

        {/* Search Button */}
        <TouchableOpacity
          onPress={onSearchPress}
          className="w-12 h-12 rounded-lg items-center justify-center border"
          style={{
            backgroundColor: colors["accent-brand-background-primary"],
            borderColor: colors["accent-brand-background-primary"],
          }}
          activeOpacity={0.7}
        >
          <MaterialIcons name="search" size={24} color={colors.white} />
        </TouchableOpacity>

        {/* Filter Button */}
        <TouchableOpacity
          onPress={onFilterPress}
          className="w-12 h-12 rounded-lg items-center justify-center border"
          style={{
            backgroundColor: filterActive
              ? colors["accent-brand"]
              : colors.white,
            borderColor: filterActive
              ? colors["accent-brand"]
              : colors["border-input"],
          }}
          activeOpacity={0.7}
        >
          <MaterialIcons
            name="tune"
            size={24}
            color={filterActive ? colors.white : colors.gray[600]}
          />
          {filterActive && (
            <View
              className="absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white"
              style={{ backgroundColor: colors["accent-red"] }}
            />
          )}
        </TouchableOpacity>
      </View>

      {filterActive && (
        <View className="mt-2">
          <Text className="text-xs" style={{ color: colors.gray[600] }}>
            <MaterialIcons
              name="info-outline"
              size={12}
              color={colors.gray[600]}
            />{" "}
            Filtros ativos
          </Text>
        </View>
      )}
    </View>
  );
};
