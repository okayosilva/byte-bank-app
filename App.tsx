import { AuthContextProvider } from "@/context/auth.context";
import Router from "@/routes";
import "react-native-url-polyfill/auto";

import { BottomSheetContextProvider } from "@/context/bottomSheet.context";
import { SnackbarContextProvider } from "@/context/snackbar.context";
import "@/styles/global.css";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SnackbarContextProvider>
        <AuthContextProvider>
          <BottomSheetContextProvider>
            <Router />
          </BottomSheetContextProvider>
        </AuthContextProvider>
      </SnackbarContextProvider>
    </GestureHandlerRootView>
  );
}
