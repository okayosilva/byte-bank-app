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
import { Text, TouchableOpacity, View } from "react-native";
import { loginFormSchema } from "./schema";

export interface LoginFormProps {
  email: string;
  password: string;
}

export const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  useEffect(() => {
    setLoginError("");
  }, []);

  const {
    control,
    handleSubmit,
    formState: { isValid, isSubmitting, errors },
  } = useForm<LoginFormProps>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: yupResolver(loginFormSchema),
  });

  const { handleAuth } = useAuthContext();
  const { notify } = useSnackbarContext();

  const { navigate } =
    useNavigation<StackNavigationProp<PublicStackParamList>>();

  const onSubmit = async (data: LoginFormProps) => {
    try {
      setIsLoading(true);
      setLoginError("");
      await handleAuth(data);
      notify({
        message: "Login realizado com sucesso!",
        type: "SUCCESS",
      });
    } catch (error: any) {
      if (error.message === "EMAIL_NOT_CONFIRMED") {
        notify({
          message:
            "Email não confirmado. Verifique sua caixa de entrada e spam para confirmar seu email antes de fazer login.",
          type: "ERROR",
        });
      } else if (
        error.message.includes("Invalid login credentials") ||
        error.message.includes("email") ||
        error.message.includes("password")
      ) {
        const errorMessage = "Email ou senha incorretos";
        setLoginError(errorMessage);
        notify({
          message: errorMessage,
          type: "ERROR",
        });
      } else {
        const errorMessage = error.message || "Erro no login";
        setLoginError(errorMessage);
        notify({
          message: errorMessage,
          type: "ERROR",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

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

      {loginError ? (
        <View className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
          <Text className="text-red-600 text-center font-medium">
            {loginError}
          </Text>
        </View>
      ) : null}

      <View className="mt-2">
        <Button
          onPress={handleSubmit(onSubmit)}
          disabled={isLoading || isSubmitting}
        >
          {isLoading || isSubmitting ? "Entrando..." : "Entrar"}
        </Button>

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
