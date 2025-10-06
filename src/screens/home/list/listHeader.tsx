import { AppHeader } from "@/components/appHeader";
import { TotalAmountTransactions } from "@/types/transactions";
import { ScrollView, View } from "react-native";
import { TransactionCard } from "./transactionCard";

interface ListHeaderProps {
  totalTransactions: TotalAmountTransactions;
}

export const ListHeader = ({ totalTransactions }: ListHeaderProps) => {
  return (
    <>
      <AppHeader amount={totalTransactions.total} />
      <View className="h-[150] w-full mt-6">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="absolute pl-6 h-[150]"
          contentContainerStyle={{
            paddingRight: 10,
          }}
        >
          <TransactionCard type="income" amount={totalTransactions.income} />
          <TransactionCard type="expense" amount={totalTransactions.expense} />
          <TransactionCard type="total" amount={totalTransactions.total} />
        </ScrollView>
      </View>
    </>
  );
};
