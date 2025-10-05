import {
  createContext,
  FC,
  PropsWithChildren,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";

import { colors } from "@/theme/colors";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { BlurView } from "expo-blur";
import { TouchableWithoutFeedback } from "react-native";

type BottomSheetContextType = {
  openBottomSheet: (content: React.ReactNode, index: number) => void;
  closeBottomSheet: () => void;
};

export const BottomSheetContext = createContext({} as BottomSheetContextType);

export const BottomSheetContextProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const [content, setContent] = useState<React.ReactNode | null>(null);
  const [index, setIndex] = useState<number | null>(-1);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = ["70%", "90%"];
  const [isOpen, setIsOpen] = useState(false);

  const openBottomSheet = useCallback(
    (newContent: React.ReactNode, newIndex: number) => {
      if (newIndex >= 0) {
        setContent(newContent);
        setIndex(newIndex);
        setIsOpen(true);
        requestAnimationFrame(() => {
          bottomSheetRef.current?.snapToIndex(newIndex);
        });
      }
    },
    []
  );

  const closeBottomSheet = useCallback(() => {
    setContent(null);
    setIsOpen(false);
    setIndex(-1);
    bottomSheetRef.current?.close();
  }, []);

  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      setIsOpen(false);
      setContent(null);
    }
  }, []);

  return (
    <BottomSheetContext.Provider value={{ openBottomSheet, closeBottomSheet }}>
      {children}

      {isOpen && (
        <TouchableWithoutFeedback onPress={closeBottomSheet}>
          <BlurView
            intensity={80}
            tint="systemThickMaterialDark"
            className="flex-1 absolute inset-0 z-1"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.25)" }}
          />
        </TouchableWithoutFeedback>
      )}

      <BottomSheet
        index={index ?? -1}
        ref={bottomSheetRef}
        onChange={handleSheetChanges}
        style={{ zIndex: 2 }}
        snapPoints={snapPoints}
        enablePanDownToClose
        backgroundStyle={{
          backgroundColor: colors["background-primary"],
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          elevation: 4,
        }}
      >
        <BottomSheetScrollView>{content}</BottomSheetScrollView>
      </BottomSheet>
    </BottomSheetContext.Provider>
  );
};

export const useBottomSheetContext = () => {
  const context = useContext(BottomSheetContext);

  if (!context) {
    throw new Error(
      "useBottomSheetContext must be used within an BottomSheetContextProvider"
    );
  }

  return context;
};
