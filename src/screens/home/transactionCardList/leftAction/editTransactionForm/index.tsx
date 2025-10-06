import { Button } from "@/components/button";
import { useBottomSheetContext } from "@/context/bottomSheet.context";
import { colors } from "@/theme/colors";
import { CreateTransactionProps, Transaction } from "@/types/transactions";
import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import CurrencyInput from "react-native-currency-input";
import * as Yup from "yup";

import { ReceiptPicker } from "@/components/receiptPicker";
import { ErrorMessage } from "@/components/transactions/errorMessage";
import { SelectModalCategory } from "@/components/transactions/modal/selectModalCategory";
import { newTransitionSchema } from "@/components/transactions/schema/newTransition-schema";
import { useSnackbarContext } from "@/context/snackbar.context";
import { useTransactionContext } from "@/context/transaction.context";
import { SelectTypeModal } from "./selectTypeModal";

export type EditTransactionProps = {
  transaction: Transaction;
};

type validationErrors = Record<keyof CreateTransactionProps, string>;

export const EditTransactionForm = ({
  transaction: existingTransaction,
}: EditTransactionProps) => {
  const [transaction, setTransaction] = useState<CreateTransactionProps>({
    type_id: existingTransaction.type_id,
    category_id: existingTransaction.category_id,
    value: existingTransaction.value / 100, // Converter de cents para reais
    description: existingTransaction.description,
    receipt_url: existingTransaction.receipt_url || undefined,
  });
  const [errors, setErrors] = useState<validationErrors>();
  const [isLoading, setIsLoading] = useState(false);
  const [showTypeModal, setShowTypeModal] = useState(false);

  const setTransactionData = (
    key: keyof CreateTransactionProps,
    value: string | number | undefined
  ) => {
    setTransaction((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  const { notify } = useSnackbarContext();
  const { closeBottomSheet } = useBottomSheetContext();
  const { updateTransaction } = useTransactionContext();

  const isIncome = transaction.type_id === 1;
  const typeTitle = "Editar Transação";
  const typeLabel = isIncome ? "Entrada" : "Saída";
  const typeIcon = isIncome ? "trending-up" : "trending-down";
  const typeColor = isIncome
    ? colors["accent-brand-light"]
    : colors["accent-red"];

  const handleGoBack = () => {
    closeBottomSheet();
  };

  const handleUpdateTransaction = async () => {
    try {
      setIsLoading(true);
      setErrors(undefined); // Limpar erros anteriores

      // Validar dados
      await newTransitionSchema.validate(transaction, {
        abortEarly: false,
      });

      // Atualizar transação
      await updateTransaction(existingTransaction.id, transaction);

      closeBottomSheet();
      notify({ message: "Transação atualizada com sucesso!", type: "SUCCESS" });
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
          message: `Erro ao atualizar transação: ${errorMessage}`,
          type: "ERROR",
        });
        console.error("Erro ao atualizar transação:", error);
      }
    } finally {
      setIsLoading(false);
    }
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

      <View className="flex-1 px-6 pt-6">
        <View className="gap-4">
          <View className="w-full">
            <Text className="text-sm font-medium mb-2">Tipo</Text>
            <TouchableOpacity
              onPress={() => setShowTypeModal(true)}
              className="rounded-lg border w-full bg-white flex-row items-center justify-between px-3 border-border-input h-12"
            >
              <View className="flex-row items-center gap-2">
                <MaterialIcons name={typeIcon} size={20} color={typeColor} />
                <Text className="text-base" style={{ color: colors.gray[800] }}>
                  {typeLabel}
                </Text>
              </View>
              <MaterialIcons
                name="chevron-right"
                size={24}
                color={colors.gray[700]}
              />
            </TouchableOpacity>
            {errors?.type_id && <ErrorMessage error={errors.type_id} />}
          </View>

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

          <View className="w-full">
            <ReceiptPicker
              receiptUrl={transaction.receipt_url}
              onReceiptSelected={(uri) =>
                setTransactionData("receipt_url", uri)
              }
              onReceiptRemoved={() =>
                setTransactionData("receipt_url", undefined)
              }
            />
          </View>

          <View className="mt-6">
            <Button onPress={handleUpdateTransaction}>
              {isLoading ? (
                <ActivityIndicator size="small" color={colors.white} />
              ) : isIncome ? (
                "Atualizar Entrada"
              ) : (
                "Atualizar Saída"
              )}
            </Button>
          </View>
        </View>
      </View>

      <SelectTypeModal
        visible={showTypeModal}
        onClose={() => setShowTypeModal(false)}
        selectedTypeId={transaction.type_id}
        onSelectType={(typeId) => setTransactionData("type_id", typeId)}
      />
    </View>
  );
};
