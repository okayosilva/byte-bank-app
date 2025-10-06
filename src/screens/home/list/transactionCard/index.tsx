import { useTransactionContext } from "@/context/transaction.context";
import { colors } from "@/theme/colors";
import { TransactionTypeNumber } from "@/types/enum";
import { MaterialIcons } from "@expo/vector-icons";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { FC } from "react";
import { Text, View } from "react-native";

export type TransactionCardType = TransactionTypeNumber | "total";
interface Props {
  type: TransactionCardType;
  amount: number;
}
interface IconsData {
  name: keyof typeof MaterialIcons.glyphMap;
  color: string;
}

const ICONS: Record<TransactionCardType, IconsData> = {
  [TransactionTypeNumber.income]: {
    name: "trending-up",
    color: colors["accent-brand-light"],
  },
  [TransactionTypeNumber.expense]: {
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
  [TransactionTypeNumber.income]: {
    label: "Entradas",
    bgColor: "bg-accent-brand/10",
  },
  [TransactionTypeNumber.expense]: {
    label: "Saídas",
    bgColor: "bg-accent-red/10",
  },
  total: {
    label: "Total",
    bgColor: "bg-accent-brand/10",
  },
};

export const TransactionCard: FC<Props> = ({ type, amount }) => {
  const iconData = ICONS[type];
  const cardData = CARD_DATA[type];

  const { transactions } = useTransactionContext();

  const lastTransaction = transactions
    .filter((transaction) => transaction.type_id === type)
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )[0];

  return (
    <View className="mr-2">
      <View className={`w-[180] h-[100] rounded-md bg-white shadow-lg py-2`}>
        <View className="flex-row items-center justify-between pb-2 px-3">
          <Text>{cardData.label}</Text>
          <View
            className={`w-7 h-7 items-center justify-center rounded-full ${cardData.bgColor}`}
          >
            <MaterialIcons
              name={iconData.name}
              size={16}
              color={iconData.color}
            />
          </View>
        </View>

        <View className=" px-3 py">
          <Text className="text-slate-900 text-xl font-medium">
            {amount.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </Text>

          <Text className="text-gray-800 text-[12px] font-regular mt-2">
            {lastTransaction?.created_at &&
              format(
                new Date(lastTransaction.created_at),
                `'Últimas ${cardData.label.toLowerCase()} em' dd MMM '`,
                {
                  locale: ptBR,
                }
              )}
          </Text>
        </View>
      </View>
    </View>
  );
};
