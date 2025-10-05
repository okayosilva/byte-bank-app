import { Animated, ViewProps } from "react-native";

interface AnimatedViewProps extends ViewProps {
  fadeAnim: Animated.Value;
  children: React.ReactNode;
}

export const AnimatedView = ({
  children,
  fadeAnim,
  ...props
}: AnimatedViewProps) => {
  return (
    <Animated.View
      {...props}
      style={[
        {
          opacity: fadeAnim,
        },
        props.style,
      ]}
    >
      {children}
    </Animated.View>
  );
};
