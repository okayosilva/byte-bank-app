import { AuthContextProvider } from "@/context/auth.context";
import Router from "@/routes";
import "react-native-url-polyfill/auto";

import "@/styles/global.css";

export default function App() {
  return (
    <AuthContextProvider>
      <Router />
    </AuthContextProvider>
  );
}
