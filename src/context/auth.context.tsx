import { supabase } from "@/lib/supabase";
import { LoginFormProps } from "@/screens/login/loginForm";
import { SignupFormProps } from "@/screens/signup/signupForm";
import { User } from "@supabase/supabase-js";
import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";

type AuthContextType = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  handleAuth: (params: LoginFormProps) => Promise<void>;
  handleSignup: (params: SignupFormProps) => Promise<void>;
  handleLogout: () => Promise<void>;
  resendConfirmationEmail: (email: string) => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
);

export const AuthContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          setUser(session.user);
          setToken(session.access_token);
        }
      } catch (error) {
        console.error("Erro ao verificar sessão:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        setToken(session.access_token);
      } else {
        setUser(null);
        setToken(null);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAuth = async ({ email, password }: LoginFormProps) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Erro no login:", error.message);

        if (error.message.includes("Email not confirmed")) {
          throw new Error("EMAIL_NOT_CONFIRMED");
        }

        throw new Error(error.message);
      }

      if (data.user) {
        setUser(data.user);
        setToken(data.session?.access_token || null);
      }
    } catch (error) {
      console.error("Erro no login:", error);
      throw error;
    }
  };

  const handleSignup = async ({ email, password, name }: SignupFormProps) => {
    try {
      // PRIMEIRO: Verifica se email já existe tentando fazer login com senha inválida
      const { error: checkError } = await supabase.auth.signInWithPassword({
        email,
        password: "invalid_password_check_12345!@#$%",
      });

      // Se retornou "Invalid login credentials", o email JÁ EXISTE
      if (
        checkError &&
        checkError.message.includes("Invalid login credentials")
      ) {
        throw new Error(
          "Este email já está cadastrado. Tente fazer login ou use outro email."
        );
      }

      // Se chegou aqui, o email não existe - prossegue com cadastro
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
          },
        },
      });

      if (error) {
        // Trata erro específico de email já existente
        if (
          error.message.includes("User already registered") ||
          error.message.includes("already registered") ||
          error.message.includes("duplicate key")
        ) {
          throw new Error(
            "Este email já está cadastrado. Tente fazer login ou use outro email."
          );
        }

        throw new Error(error.message);
      }

      // Verifica se o usuário foi realmente criado
      if (!data || !data.user) {
        throw new Error(
          "Este email já está cadastrado. Tente fazer login ou use outro email."
        );
      }
    } catch (error) {
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error("Erro no logout:", error.message);
        throw new Error(error.message);
      }

      setUser(null);
      setToken(null);
    } catch (error) {
      console.error("Erro no logout:", error);
      throw error;
    }
  };

  const resendConfirmationEmail = async (email: string) => {
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: email,
      });

      if (error) {
        console.error("Erro ao reenviar email:", error.message);
        throw new Error(error.message);
      }
    } catch (error) {
      console.error("Erro ao reenviar email:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        handleAuth,
        handleSignup,
        handleLogout,
        resendConfirmationEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuthContext must be used within an AuthContextProvider"
    );
  }

  return context;
};
