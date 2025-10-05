import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { PublicStackParamList } from "@/routes/stack/publicStacks";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useForm } from "react-hook-form";
import { Text, TouchableOpacity, View } from "react-native";

export interface SignupFormProps {
  email: string;
  password: string;
  name: string;
  confirmPassword: string;
}

export const SignupForm = () => {
  const {
    control,
    handleSubmit,
    formState: { isValid, isSubmitting, errors },
  } = useForm<SignupFormProps>({});

  const { navigate } =
    useNavigation<StackNavigationProp<PublicStackParamList>>();

  return (
    <>
      <Input
        control={control}
        name="name"
        label="Nome"
        placeholder="Insira seu nome completo"
      />
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
        placeholder="********"
        secureTextEntry
      />
      <Input
        control={control}
        name="confirmPassword"
        label="Confirmar Senha"
        placeholder="********"
        secureTextEntry
      />

      <View className="mt-2">
        <Button>Cadastrar</Button>

        <TouchableOpacity activeOpacity={0.9} onPress={() => navigate("login")}>
          <View className="flex-row items-center justify-center">
            <Text className="text-center mt-9 text-base font-medium text-gray-500">
              Voltar para o login
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </>
  );
};
