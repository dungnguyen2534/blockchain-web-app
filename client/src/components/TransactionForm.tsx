import { useTransactionContext } from "../context/useTransactionContext";
import Input from "./ui/Input";
import LoadingButton from "./LoadingButton";
import { toast } from "sonner";
import { isValidEthereumAddress } from "../utils/utils";

export default function TransactionForm() {
  const {
    formData,
    setFormData,
    sendTransaction,
    handleChange,
    isSending,
    currentAccount,
  } = useTransactionContext();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { addressTo, amount } = formData;
    if (!addressTo || !amount) return;

    const numericAmount = parseFloat(amount);
    if (
      !isValidEthereumAddress(addressTo) ||
      isNaN(numericAmount) ||
      numericAmount <= 0
    ) {
      toast.warning("Please enter valid transaction data");
      return;
    }

    await sendTransaction();
    setFormData({
      addressTo: "",
      amount: "",
    });
  };

  return (
    <form
      className="flex flex-col gap-2 [&>*]:w-full card card-border p-5 bg-base-200"
      onSubmit={handleSubmit}
    >
      <h1 className="card-title">Make a transaction:</h1>
      <Input
        placeholder="Receiver address"
        name="addressTo"
        value={formData.addressTo}
        handleChange={handleChange}
        disabled={!currentAccount}
      />
      <Input
        placeholder="Amount"
        name="amount"
        type="number"
        value={formData.amount}
        handleChange={handleChange}
        step={0.0001}
        disabled={!currentAccount}
      />
      <LoadingButton
        loading={isSending}
        loadingText="Might take a while..."
        className="btn-primary"
        type="submit"
        disabled={!currentAccount}
      >
        Send with MetaMask
      </LoadingButton>
    </form>
  );
}
