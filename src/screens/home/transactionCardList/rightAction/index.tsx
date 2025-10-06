import { useSnackbarContext } from "@/context/snackbar.context";
import { useTransactionContext } from "@/context/transaction.context";
import { colors } from "@/theme/colors";
import { MaterialIcons } from "@expo/vector-icons";
import { FC, useState } from "react";
import { TouchableOpacity } from "react-native";
import { DeleteModal } from "./deleteModal";

interface Props {
  transactionId: number;
}

export const RightAction: FC<Props> = ({ transactionId }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const { deleteTransaction } = useTransactionContext();
  const { notify } = useSnackbarContext();

  const handleModalPress = () => {
    setModalVisible(true);
  };

  const hideModal = () => {
    setModalVisible(false);
  };

  const handleDeleteTransaction = async () => {
    try {
      setLoading(true);
      await deleteTransaction(transactionId);
      hideModal();
      notify({
        message: "Transação excluída com sucesso!",
        type: "SUCCESS",
      });
    } catch (error) {
      console.error("Erro ao excluir transação:", error);
      notify({
        message: "Erro ao excluir transação",
        type: "ERROR",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <TouchableOpacity
        activeOpacity={0.7}
        className="bg-accent-red w-[80] h-[80] items-center justify-center rounded-r-lg"
        onPress={handleModalPress}
      >
        <MaterialIcons
          name="delete-outline"
          size={30}
          color={colors["white"]}
        />
      </TouchableOpacity>
      <DeleteModal
        modalVisible={modalVisible}
        hideModal={hideModal}
        handleDeleteTransaction={handleDeleteTransaction}
        loading={loading}
      />
    </>
  );
};
