import { useTransactionContext } from "@/context/transaction.context";
import { colors } from "@/theme/colors";
import { TransactionTypeNumber } from "@/types/enum";
import { Transaction } from "@/types/transactions";
import { MaterialIcons } from "@expo/vector-icons";
import { format } from "date-fns";
import { FC } from "react";
import { Text, View } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { RightAction } from "./rightAction";
import { LeftAction } from "./leftAction";

interface Props {
  transaction: Transaction;
}

export const TransactionListCard: FC<Props> = ({ transaction }) => {
  const { categories } = useTransactionContext();

  const category = categories.find(
    (category) => category.id === transaction.category_id
  );

  const isIncome = transaction.type_id === TransactionTypeNumber.income;
  const valueColor = isIncome
    ? colors["accent-brand-light"]
    : colors["accent-red"];
  const valuePrefix = isIncome ? "+ " : "- ";

  return (
    <Swipeable
      containerStyle={{
        alignItems: "center",
        alignSelf: "center",
        overflow: "hidden",
        width: "90%",
        marginBottom: 12,
      }}
      renderRightActions={() => <RightAction transactionId={transaction.id} />}
      renderLeftActions={() => <LeftAction transaction={transaction} />}
      rightThreshold={40}
      friction={2}
      overshootRight={false}
      overshootLeft={false}
    >
      <View className="w-full h-[80] bg-white rounded-lg shadow-sm">
        <View className="flex-row  w-full items-center h-full px-4">
          <View
            className="w-10 h-10 items-center justify-center rounded-full mr-4"
            style={{
              backgroundColor: isIncome
                ? `${colors["accent-brand-light"]}20`
                : `${colors["accent-red"]}20`,
            }}
          >
            <MaterialIcons
              name={isIncome ? "trending-up" : "trending-down"}
              size={20}
              color={
                isIncome ? colors["accent-brand-light"] : colors["accent-red"]
              }
            />
          </View>

          <View className="flex-1">
            <Text
              className="text-gray-800 text-base font-medium mb-1"
              numberOfLines={1}
            >
              {transaction.description}
            </Text>

            <Text className="text-lg font-bold" style={{ color: valueColor }}>
              {valuePrefix}
              {Math.abs(transaction.value / 100).toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </Text>
          </View>

          <View className="items-end">
            <View className="items-center gap-2">
              <View className="flex-row items-center gap-2">
                <MaterialIcons
                  name="label-outline"
                  size={14}
                  color={colors["gray"][700]}
                />
                <Text className="text-gray-500 text-sm">
                  {
                    categories.find(
                      (category) => category.id === transaction.category_id
                    )?.name
                  }
                </Text>
              </View>

              <Text className="text-gray-500 text-sm">
                {format(new Date(transaction.created_at), "dd/MM/yy")}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Swipeable>
  );
};
