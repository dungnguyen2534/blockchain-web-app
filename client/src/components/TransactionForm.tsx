import { useTransactionContext } from "../context/useTransactionContext";
import formatEthereumAddress from "../utils/utils";
import Button from "./Button";
import Input from "./Input";
import LoadingButton from "./LoadingButton";
export default function TransactionForm() {
  const {
    connectWallet,
    currentAccount,
    formData,
    sendTransaction,
    handleChange,
    isSending,
  } = useTransactionContext();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { addressTo, amount } = formData;
    if (!addressTo || !amount) return;

    sendTransaction();
  };

  return (
    <div className="space-y-3">
      {!currentAccount ? (
        <Button onClick={connectWallet}>Connect wallet</Button>
      ) : (
        <div className="card card-border p-5  bg-base-200">
          <div>{formatEthereumAddress(currentAccount)}</div>
        </div>
      )}

      <form
        className="flex flex-col gap-2 [&>*]:w-full card card-border p-5 bg-base-200"
        onSubmit={handleSubmit}
      >
        <h1 className="card-title">Make a transaction:</h1>
        <Input
          placeholder="Address To"
          name="addressTo"
          value={formData.addressTo}
          handleChange={handleChange}
        />
        <Input
          placeholder="Amount"
          name="amount"
          type="number"
          value={formData.amount}
          handleChange={handleChange}
          step={0.0001}
        />
        <LoadingButton
          loading={isSending}
          loadingText="Might take a while..."
          className="btn-primary"
          type="submit"
        >
          Send with MetaMask
        </LoadingButton>
      </form>
    </div>
  );
}
