import { useBottomSheetContext } from "@/context/bottomSheet.context";
import { colors } from "@/theme/colors";
import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Text, TouchableOpacity, View } from "react-native";
import { Button } from "../button";
import { Input } from "../input";

type NewTransactionProps = {
  transactionType: "income" | "expense";
};

type TransactionFormData = {
  amount: string;
  description: string;
  category: string;
  date: string;
};

type TabType = "form" | "categories";

export const NewTransaction = ({ transactionType }: NewTransactionProps) => {
  const { closeBottomSheet, openBottomSheet } = useBottomSheetContext();
  const [activeTab, setActiveTab] = useState<TabType>("form");

  const formatDateToBrazilian = (date: Date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const { control, handleSubmit, watch } = useForm<TransactionFormData>({
    defaultValues: {
      amount: "",
      description: "",
      category: "",
      date: formatDateToBrazilian(new Date()),
    },
  });

  const onSubmit = (data: TransactionFormData) => {
    console.log("Transaction data:", { ...data, type: transactionType });
    closeBottomSheet();
  };
  const isIncome = transactionType === "income";
  const typeTitle = isIncome ? "Nova Entrada" : "Nova Saída";

  const handleGoBack = () => {
    closeBottomSheet();
  };

  return (
    <View className="flex-1">
      <View className="p-6">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-3">
            <TouchableOpacity onPress={() => handleGoBack()}>
              <MaterialIcons
                name={"chevron-left"}
                size={24}
                color={colors.gray[700]}
              />
            </TouchableOpacity>

            <Text className="text-slate-900 text-lg font-bold">
              {typeTitle}
            </Text>
          </View>
          <TouchableOpacity onPress={() => closeBottomSheet()}>
            <MaterialIcons name="close" size={24} color={colors.gray[700]} />
          </TouchableOpacity>
        </View>
        <View className="mt-4 border-b-2 border-gray-400"></View>
      </View>

      {/* Tab Bar */}
      <View className="px-6">
        <View className="flex-row bg-gray-100 rounded-lg p-1">
          <TouchableOpacity
            className={`flex-1 py-2 rounded-md ${
              activeTab === "form" ? "bg-white shadow-sm" : ""
            }`}
            onPress={() => setActiveTab("form")}
          >
            <Text
              className={`text-center font-medium ${
                activeTab === "form" ? "text-slate-900" : "text-gray-600"
              }`}
            >
              Formulário
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`flex-1 py-2 rounded-md ${
              activeTab === "categories" ? "bg-white shadow-sm" : ""
            }`}
            onPress={() => setActiveTab("categories")}
          >
            <Text
              className={`text-center font-medium ${
                activeTab === "categories" ? "text-slate-900" : "text-gray-600"
              }`}
            >
              Categorias
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View className="flex-1 px-6 pt-6">
        {activeTab === "form" ? (
          <View className="gap-4">
            <Input
              control={control}
              name="amount"
              label="Valor"
              placeholder="0,00"
              keyboardType="numeric"
            />
            <Input
              control={control}
              name="description"
              label="Descrição"
              placeholder="Digite uma descrição"
            />
            <Input
              control={control}
              name="category"
              label="Categoria"
              placeholder="Selecione uma categoria"
            />
            <Input
              control={control}
              name="date"
              label="Data"
              placeholder="DD/MM/AAAA"
            />

            <View className="mt-6">
              <Button onPress={handleSubmit(onSubmit)}>
                {isIncome ? "Adicionar Entrada" : "Adicionar Saída"}
              </Button>
            </View>
          </View>
        ) : (
          <View className="gap-3">
            <Text className="text-slate-900 text-base font-bold mb-4">
              Categorias {isIncome ? "de Entrada" : "de Saída"}
            </Text>

            {isIncome ? (
              <View className="gap-3">
                {[
                  "Salário",
                  "Freelance",
                  "Investimentos",
                  "Vendas",
                  "Outros",
                ].map((category) => (
                  <TouchableOpacity
                    key={category}
                    className="flex-row items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <Text className="text-slate-900 font-medium">
                      {category}
                    </Text>
                    <MaterialIcons
                      name="chevron-right"
                      size={24}
                      color={colors.gray[700]}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <View className="gap-3">
                {[
                  "Alimentação",
                  "Transporte",
                  "Lazer",
                  "Saúde",
                  "Educação",
                  "Outros",
                ].map((category) => (
                  <TouchableOpacity
                    key={category}
                    className="flex-row items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <Text className="text-slate-900 font-medium">
                      {category}
                    </Text>
                    <MaterialIcons
                      name="chevron-right"
                      size={24}
                      color={colors.gray[700]}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        )}
      </View>
    </View>
  );
};
