import { AuthContextProvider } from "@/context/auth.context";
import Router from "@/routes";
import "react-native-url-polyfill/auto";

import { SnackbarContextProvider } from "@/context/snackbar.context";
import "@/styles/global.css";

export default function App() {
  return (
    <SnackbarContextProvider>
      <AuthContextProvider>
        <Router />
      </AuthContextProvider>
    </SnackbarContextProvider>
  );
}
