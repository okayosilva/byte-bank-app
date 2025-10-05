import { useEffect, useRef } from "react";
import { Animated, Easing, Text, View } from "react-native";

export const LoadingScreen = () => {
  const spinValue = useRef(new Animated.Value(0)).current;
  const fadeValue = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    const spin = () => {
      spinValue.setValue(0);
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(() => spin());
    };

    Animated.timing(fadeValue, {
      toValue: 1,
      duration: 800,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();

    Animated.timing(scaleValue, {
      toValue: 1,
      duration: 800,
      easing: Easing.out(Easing.back(1.2)),
      useNativeDriver: true,
    }).start();

    spin();
  }, [spinValue, fadeValue, scaleValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Animated.View
        style={{
          opacity: fadeValue,
          transform: [{ scale: scaleValue }],
        }}
        className="items-center"
      >
        <View className="mb-8 relative">
          <Animated.View
            style={{
              transform: [{ rotate: spin }],
            }}
            className="w-20 h-20 border-4 border-red-100 border-t-red-500 rounded-full"
          />

          <Animated.View
            style={{
              transform: [{ rotate: spin }],
            }}
            className="absolute top-2 left-2 w-16 h-16 border-2 border-red-200 border-b-red-400 rounded-full"
          />
        </View>

        <Text className="text-3xl font-bold text-gray-800 mb-2">Bytebank</Text>

        <View className="flex-row items-center mb-2">
          <Text className="text-lg font-medium text-gray-600">Carregando</Text>
          <Animated.Text
            style={{
              opacity: fadeValue,
            }}
            className="text-lg font-medium text-gray-600 ml-1"
          >
            ...
          </Animated.Text>
        </View>

        <Text className="text-sm text-gray-500 text-center px-8">
          Preparando sua experiência bancária segura
        </Text>
      </Animated.View>
    </View>
  );
};
