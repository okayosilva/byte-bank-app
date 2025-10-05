import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { useAuthContext } from "@/context/auth.context";
import { PublicStackParamList } from "@/routes/stack/publicStacks";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { signupFormSchema } from "./schema";

export interface SignupFormProps {
  email: string;
  password: string;
  name: string;
  confirmPassword: string;
}

interface SignupFormComponentProps {
  onNavigateBack?: () => void;
}

export const SignupForm = ({ onNavigateBack }: SignupFormComponentProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { isValid, isSubmitting, errors },
  } = useForm<SignupFormProps>({
    defaultValues: {
      email: "",
      password: "",
      name: "",
      confirmPassword: "",
    },
    resolver: yupResolver(signupFormSchema),
  });

  const { navigate } =
    useNavigation<StackNavigationProp<PublicStackParamList>>();

  const { handleSignup } = useAuthContext();

  const onSubmit = async (data: SignupFormProps) => {
    try {
      setIsLoading(true);
      await handleSignup(data);

      Alert.alert(
        "Cadastro realizado!",
        "Enviamos um email de confirmação para você. Verifique sua caixa de entrada e spam, depois volte aqui para fazer login.",
        [
          {
            text: "OK",
            onPress: () => navigate("login"),
          },
        ]
      );
    } catch (error: any) {
      console.error("Erro no cadastro:", error);
      Alert.alert("Erro", error.message || "Erro no cadastro");
    } finally {
      setIsLoading(false);
    }
  };

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
        <Button
          onPress={handleSubmit(onSubmit)}
          disabled={isLoading || isSubmitting}
        >
          {isLoading || isSubmitting ? "Cadastrando..." : "Cadastrar"}
        </Button>

        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => {
            onNavigateBack?.();
            navigate("login");
          }}
        >
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
