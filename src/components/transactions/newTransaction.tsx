import { useBottomSheetContext } from "@/context/bottomSheet.context";
import { colors } from "@/theme/colors";
import { CreateTransactionProps, TransactionTypes } from "@/types/transactions";
import { MaterialIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import CurrencyInput from "react-native-currency-input";
import * as Yup from "yup";
import { Button } from "../button";

import { useSnackbarContext } from "@/context/snackbar.context";
import { useTransactionContext } from "@/context/transaction.context";
import { ErrorMessage } from "./errorMessage";
import { SelectModalCategory } from "./modal/selectModalCategory";
import { newTransitionSchema } from "./schema/newTransition-schema";

export type NewTransactionProps = {
  transactionType: TransactionTypes;
};

type validationErrors = Record<keyof CreateTransactionProps, string>;

export const NewTransaction = ({ transactionType }: NewTransactionProps) => {
  const [transaction, setTransaction] = useState<CreateTransactionProps>({
    type_id: 0,
    category_id: 0,
    value: 0,
    description: "",
  });
  const [errors, setErrors] = useState<validationErrors>();
  const [isLoading, setIsLoading] = useState(false);

  const setTransactionData = (
    key: keyof CreateTransactionProps,
    value: string | number
  ) => {
    setTransaction((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  const { notify } = useSnackbarContext();
  const { closeBottomSheet } = useBottomSheetContext();
  const { createTransaction } = useTransactionContext();

  const isIncome = transactionType === "income";
  const typeTitle = isIncome ? "Nova Entrada" : "Nova Saída";

  const handleGoBack = () => {
    closeBottomSheet();
  };

  const handleCreateTransaction = async () => {
    try {
      setIsLoading(true);
      setErrors(undefined); // Limpar erros anteriores

      // Validar dados
      await newTransitionSchema.validate(transaction, {
        abortEarly: false,
      });

      // Criar transação
      await createTransaction(transaction);

      closeBottomSheet();
      notify({ message: "Transação criada com sucesso!", type: "SUCCESS" });
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const errors = {} as validationErrors;

        error.inner.forEach((err) => {
          if (err.path) {
            errors[err.path as keyof CreateTransactionProps] = err.message;
          }
        });

        notify({ message: "Erro de validação!", type: "ERROR" });
        setErrors(errors);
      } else {
        // Erro do Supabase ou outros erros
        const errorMessage =
          error instanceof Error ? error.message : "Erro desconhecido";
        notify({
          message: `Erro ao criar transação: ${errorMessage}`,
          type: "ERROR",
        });
        console.error("Erro ao criar transação:", error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setTransactionData("type_id", transactionType === "income" ? 1 : 2);
  }, []);

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

      <View className="flex-1 px-6 pt-6">
        <View className="gap-4">
          <View className="w-full">
            <Text className="text-sm font-medium mb-2">Descrição</Text>
            <TextInput
              onChangeText={(text) => setTransactionData("description", text)}
              placeholder="Descrição"
              placeholderTextColor={colors.gray[700]}
              value={transaction.description}
              className="rounded-lg border w-full bg-white flex-row items-center justify-between px-3 border-border-input h-12"
            />
            {errors?.description && <ErrorMessage error={errors.description} />}
          </View>

          <View className="w-full">
            <SelectModalCategory
              selectedCategoryId={transaction.category_id}
              onSelectCategory={(categoryId) =>
                setTransactionData("category_id", categoryId)
              }
            />
            {errors?.category_id && <ErrorMessage error={errors.category_id} />}
          </View>

          <View className="w-full">
            <Text className="text-sm font-medium mb-2">Valor</Text>
            <CurrencyInput
              prefix="R$"
              separator=","
              delimiter="."
              minValue={0}
              precision={2}
              value={transaction.value}
              onChangeValue={(value) => setTransactionData("value", value ?? 0)}
              placeholder="0"
              keyboardType="numeric"
              className="rounded-lg border w-full bg-white flex-row items-center justify-between px-3 border-border-input h-12"
            />
            {errors?.value && <ErrorMessage error={errors.value} />}
          </View>

          <View className="mt-6">
            <Button onPress={handleCreateTransaction}>
              {isLoading ? (
                <ActivityIndicator size="small" color={colors.white} />
              ) : isIncome ? (
                "Registrar Entrada"
              ) : (
                "Registrar Saída"
              )}
            </Button>
          </View>
        </View>
      </View>
    </View>
  );
};
