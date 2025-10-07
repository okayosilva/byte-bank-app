import { AnimatedView } from "@/components/animatedView";
import { Button } from "@/components/button";
import { colors } from "@/theme/colors";
import { ONBOARDING_STORAGE_KEY } from "@/utils/constants/onboarding";
import { useAnimatedView } from "@/utils/hooks/useAnimatedView";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Text,
  TouchableOpacity,
  View,
  ViewToken,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

interface OnboardingSlide {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  color: string;
}

const slides: OnboardingSlide[] = [
  {
    id: "1",
    title: "Gerencie suas Finanças",
    description:
      "Controle todas as suas receitas e despesas em um só lugar. Adicione transações rapidamente com categorias personalizadas e anexe comprovantes.",
    icon: "account-balance-wallet",
    color: colors["accent-brand"],
  },
  {
    id: "2",
    title: "Dashboard Inteligente",
    description:
      "Visualize seus dados com gráficos interativos e receba insights automáticos sobre seus hábitos financeiros. Compare períodos e identifique tendências.",
    icon: "insights",
    color: colors["accent-brand-background-primary"],
  },
  {
    id: "3",
    title: "Filtros Avançados",
    description:
      "Busque transações por período, categoria ou ano específico. Use filtros rápidos para encontrar exatamente o que precisa em segundos.",
    icon: "filter-list",
    color: "#F59E0B",
  },
  {
    id: "4",
    title: "Busca Anual e Relatórios",
    description:
      "Digite um ano na busca e veja o resumo completo de receitas e despesas. Acompanhe sua evolução financeira ao longo do tempo.",
    icon: "analytics",
    color: colors["accent-brand-light"],
  },
];

export const Onboarding = () => {
  const { fadeAnim, fadeIn } = useAnimatedView();
  const navigation = useNavigation();
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fadeIn();
  }, []);

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0) {
        setCurrentIndex(viewableItems[0].index || 0);
      }
    },
    []
  );

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      handleComplete();
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_STORAGE_KEY, "true");
      navigation.navigate("login" as never);
    } catch (error) {
      console.error("Erro ao salvar onboarding:", error);
      navigation.navigate("login" as never);
    }
  };

  const renderSlide = ({ item }: { item: OnboardingSlide }) => (
    <View className="flex-1 items-center justify-center px-8" style={{ width }}>
      <View
        className="w-32 h-32 rounded-full items-center justify-center mb-8"
        style={{
          backgroundColor: item.color,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 6,
          elevation: 8,
        }}
      >
        <MaterialIcons name={item.icon} size={64} color={colors.white} />
      </View>

      <Text
        className="text-3xl font-bold text-center mb-4"
        style={{ color: colors["background-secondary"] }}
      >
        {item.title}
      </Text>

      <Text
        className="text-base text-center leading-6"
        style={{ color: colors.gray[600] }}
      >
        {item.description}
      </Text>
    </View>
  );

  const renderPagination = () => (
    <View className="flex-row items-center justify-center mb-8">
      {slides.map((_, index) => (
        <View
          key={index}
          className="mx-1 rounded-full"
          style={{
            width: currentIndex === index ? 24 : 8,
            height: 8,
            backgroundColor:
              currentIndex === index
                ? colors["accent-brand-background-primary"]
                : colors.gray[400],
          }}
        />
      ))}
    </View>
  );

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: colors["background-primary"] }}
    >
      <AnimatedView fadeAnim={fadeAnim} style={{ flex: 1 }}>
        <View className="items-end px-6 pt-4">
          <TouchableOpacity
            onPress={handleSkip}
            className="py-2 px-4"
            activeOpacity={0.7}
          >
            <Text
              className="text-base font-semibold"
              style={{ color: colors.gray[600] }}
            >
              Pular
            </Text>
          </TouchableOpacity>
        </View>

        <FlatList
          ref={flatListRef}
          data={slides}
          renderItem={renderSlide}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          bounces={false}
          decelerationRate="fast"
          scrollEventThrottle={16}
        />

        <View className="px-6 pb-8">
          {renderPagination()}

          <View className="flex-row items-center gap-3">
            {currentIndex > 0 && (
              <TouchableOpacity
                onPress={() => {
                  flatListRef.current?.scrollToIndex({
                    index: currentIndex - 1,
                    animated: true,
                  });
                }}
                className="w-12 h-12 rounded-full items-center justify-center"
                style={{ backgroundColor: colors.gray[400] }}
                activeOpacity={0.7}
              >
                <MaterialIcons
                  name="arrow-back"
                  size={24}
                  color={colors.gray[700]}
                />
              </TouchableOpacity>
            )}

            <View className="flex-1">
              <Button onPress={handleNext}>
                {currentIndex === slides.length - 1 ? "Começar" : "Próximo"}
              </Button>
            </View>
          </View>
        </View>
      </AnimatedView>
    </SafeAreaView>
  );
};
