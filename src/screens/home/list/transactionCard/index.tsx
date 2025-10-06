import { colors } from "@/theme/colors";
import { TransactionTypes } from "@/types/transactions";
import { MaterialIcons } from "@expo/vector-icons";
import clsx from "clsx";
import { Text, View } from "react-native";

type TransactionCardType = TransactionTypes | "total";

interface TransactionCardProps {
  type: TransactionCardType | "total";
  amount: number;
}

interface IconsData {
  name: keyof typeof MaterialIcons.glyphMap;
  color: string;
}

const ICONS: Record<TransactionCardType, IconsData> = {
  income: {
    name: "trending-up",
    color: colors["accent-brand-light"],
  },
  expense: {
    name: "trending-down",
    color: colors["accent-red"],
  },
  total: {
    name: "attach-money",
    color: colors["accent-brand-light"],
  },
};

interface CardData {
  label: string;
  bgColor: string;
}

const CARD_DATA: Record<TransactionCardType, CardData> = {
  income: {
    label: "Entradas",
    bgColor: "bg-accent-brand/10",
  },
  expense: {
    label: "Saídas",
    bgColor: "bg-accent-red/10",
  },
  total: {
    label: "Total",
    bgColor: "bg-accent-brand/10",
  },
};

export const TransactionCard = ({ type, amount }: TransactionCardProps) => {
  const iconData = ICONS[type];
  const cardData = CARD_DATA[type];
  return (
    <View className="mr-2">
      <View className={`w-[143] h-[74] rounded-md bg-white shadow-lg`}>
        <View className="flex-row items-center justify-between py-2 px-3">
          <Text>{cardData.label}</Text>
          <View
            className={clsx(
              "w-7 h-7 items-center justify-center rounded-full",
              cardData.bgColor
            )}
          >
            <MaterialIcons
              name={iconData.name}
              size={16}
              color={iconData.color}
            />
          </View>
        </View>

        <View className="flex-row items-center justify-between px-3 py-2">
          <Text className="text-slate-900 text-sm font-medium">
            {amount.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </Text>
        </View>
      </View>
    </View>
  );
};
