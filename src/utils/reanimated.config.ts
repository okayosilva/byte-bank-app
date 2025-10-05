import { configureReanimatedLogger } from "react-native-reanimated";

// Configuração para reduzir warnings do Reanimated
configureReanimatedLogger({
  // Desabilita logs de debug em produção
  strict: __DEV__ ? false : false,
  // Define nível de log
  level: __DEV__ ? "warn" : "error",
});
