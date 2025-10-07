import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { useAuthContext } from "@/context/auth.context";
import { useSnackbarContext } from "@/context/snackbar.context";
import { PublicStackParamList } from "@/routes/stack/publicStacks";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useEffect, useState } from "react";
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
  const [signupError, setSignupError] = useState("");

  const {
    control,
    handleSubmit,
    watch,
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

  // Observa mudanças no campo email para limpar erro
  const emailValue = watch("email");

  const { navigate } =
    useNavigation<StackNavigationProp<PublicStackParamList>>();

  const { handleSignup } = useAuthContext();
  const { notify } = useSnackbarContext();

  // Limpa erro quando usuário MODIFICA o email (não apenas quando tem valor)
  useEffect(() => {
    if (signupError) {
      setSignupError("");
    }
  }, [emailValue]);

  const onSubmit = async (data: SignupFormProps) => {
    setIsLoading(true);
    setSignupError(""); // Limpar erro anterior

    try {
      await handleSignup(data);

      // Sucesso - mostra notify e alert
      notify({
        message: "Cadastro realizado com sucesso!",
        type: "SUCCESS",
      });

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
      // Para todos os erros, mostra notify
      notify({
        message: error.message || "Erro no cadastro",
        type: "ERROR",
      });

      // Se é erro de email já existente, também mostra o card visual
      if (error.message && error.message.includes("já está cadastrado")) {
        setSignupError(error.message);
      }
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

      {/* Exibe erro de email já existente */}
      {signupError && (
        <View className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <Text className="text-red-700 text-base mb-3">{signupError}</Text>
        </View>
      )}

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
