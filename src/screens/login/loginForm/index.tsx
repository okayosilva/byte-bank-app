import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { PublicStackParamList } from "@/routes/stack/publicStacks";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useForm } from "react-hook-form";
import { Text, TouchableOpacity, View } from "react-native";

export interface LoginFormProps {
  email: string;
  password: string;
}

export const LoginForm = () => {
  const {
    control,
    handleSubmit,
    formState: { isValid, isSubmitting, errors },
  } = useForm<LoginFormProps>({});

  const { navigate } =
    useNavigation<StackNavigationProp<PublicStackParamList>>();

  return (
    <>
      <Input
        control={control}
        name="email"
        label="Email"
        placeholder="mail@example.com"
      />
      <Input
        control={control}
        name="password"
        label="Senha"
        secureTextEntry
        placeholder="********"
      />

      <View className="mt-2">
        <Button>Entrar</Button>

        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => navigate("signup")}
        >
          <Text className="text-center mt-9 text-base font-medium text-gray-500">
            Não tem conta?
            <Text className="text-accent-brand-background-primary">
              {" "}
              Cadastre-se
            </Text>
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
};
