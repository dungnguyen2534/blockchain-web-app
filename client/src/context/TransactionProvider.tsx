import { useCallback, useEffect, useState } from "react";
import { TransactionContext } from "./useTransactionContext";
import type { MainFormDataType, Transaction } from "../types/types";
import { contractABI, contractAddress } from "../utils/constants";
import { ethers, formatEther } from "ethers";
import { BrowserProvider } from "ethers";
import type { Eip1193Provider } from "ethers";
import type { Transactions } from "../typechain-types";
import { toast } from "sonner";

const { ethereum } = window as typeof window & { ethereum?: Eip1193Provider };
const searchParams = new URLSearchParams(window.location.search);
const pageFromUrl = parseInt(searchParams.get("page") ?? "1", 10);

const PAGE_SIZE = 10;

export function TransactionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoadingAccount, setIsLoadingAccount] = useState(true);
  const [currentAccount, setCurrentAccount] = useState("");

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isSending, setIsSending] = useState(false);

  const [currentPage, setCurrentPage] = useState(pageFromUrl);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [isLoadingTransactionsHistory, setIsLoadingTransactionsHistory] =
    useState(true);

  const [latestTransaction, setLatestTransaction] = useState<
    (Transaction & { hash: string }) | null
  >(() => {
    const localData = localStorage.getItem("latest_transaction");
    if (localData) return JSON.parse(localData);
    return null;
  });

  const [formData, setFormData] = useState<MainFormDataType>({
    addressTo: "",
    amount: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    name: string
  ) => {
    setFormData((prev) => ({ ...prev, [name]: e.target.value }));
  };

  const getEtheriumContract = useCallback(async (ethereum: Eip1193Provider) => {
    try {
      const provider = new BrowserProvider(ethereum);
      const signer = await provider.getSigner();
      const transactionContract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      ) as unknown as Transactions;

      return transactionContract;
    } catch (error) {
      console.error(error);
      throw new Error("Error in getEtheriumContract");
    }
  }, []);

  const getTransactionsPage = useCallback(
    async (startIndex: number, pageSize: number) => {
      try {
        if (ethereum) {
          if (!currentAccount) return;
          const transactionContract = await getEtheriumContract(ethereum);
          const result =
            await transactionContract.getTransactionsPageAndTotalPages(
              startIndex,
              pageSize
            );
          const structuredTransactions = result[0].map(
            // eslint-disable-next-line
            (transaction: any) => ({
              addressTo: transaction.receiver,
              addressFrom: transaction.sender,
              timestamp: new Date(
                Number(transaction.timestamp * 1000n)
              ).toLocaleString(),
              message: transaction.message,
              amount: formatEther(transaction.amount),
            })
          );

          setTransactions(structuredTransactions);
          setTotalPages(Number(result[1])); // the data received is typed as bigint, but it will never be a bigint
        } else {
          toast.error("Please install and login to MetaMask.");
        }
      } catch {
        toast.error("Something went wrong, try reload the page.");
      }
    },
    [getEtheriumContract, currentAccount]
  );

  const getCurrentTransactionsPage = useCallback(async () => {
    if (currentAccount === "") {
      setIsLoadingTransactionsHistory(false);
      return;
    }

    const startIndex = (currentPage - 1) * PAGE_SIZE;
    if (startIndex < 0) {
      setIsLoadingTransactionsHistory(true);
      await getTransactionsPage(0, PAGE_SIZE);
      setIsLoadingTransactionsHistory(false);
    } else {
      setIsLoadingTransactionsHistory(true);
      await getTransactionsPage(startIndex, PAGE_SIZE);
      setIsLoadingTransactionsHistory(false);
    }
  }, [currentPage, getTransactionsPage, currentAccount]);

  const connectWallet = useCallback(async () => {
    try {
      if (!ethereum) return alert("Please install and login to MetaMask");

      const accounts = await ethereum.request({ method: "eth_accounts" });
      if (accounts.length === 0) {
        alert("Please log in to MetaMask first.");
      }

      const account = await ethereum.request({
        method: "eth_requestAccounts",
      });

      setCurrentAccount(account[0]);
      getCurrentTransactionsPage();
    } catch (error: unknown) {
      const rpcError = error as {
        code?: number;
        message?: string;
        data?: unknown;
      };

      if (typeof rpcError.code === "number") {
        if (rpcError.code === -32002) {
          return;
        } else {
          toast.error("Something went wrong, try reload the page.");
        }
      } else {
        toast.error("Something went wrong, try reload the page.");
      }
    }
  }, [getCurrentTransactionsPage]);

  const sendTransaction = useCallback(async () => {
    try {
      if (!ethereum) return alert("Please install and login to MetaMask");
      const transactionContract = await getEtheriumContract(ethereum);
      const { addressTo, amount } = formData;
      const parsedAmount = ethers.parseEther(amount);

      setIsSending(true);

      const transactionResponse = await transactionContract.transferAndRecord(
        addressTo,
        { value: parsedAmount }
      );

      const transactionReceipt = await transactionResponse.wait();
      setIsSending(false);
      toast.success("Transaction completed.");

      const transferEvent = transactionReceipt?.logs.find((log) => {
        const transferTopic =
          transactionContract.interface.getEvent("Transfer").topicHash;
        return log.topics[0] === transferTopic;
      });

      if (transferEvent) {
        const decodedEvent = transactionContract.interface.decodeEventLog(
          "Transfer",
          transferEvent.data,
          transferEvent.topics
        );

        const transactionData = {
          addressFrom: decodedEvent.from,
          addressTo: decodedEvent.receiver,
          amount: formatEther(decodedEvent.amount),
          timestamp: new Date(
            Number(decodedEvent.timestamp) * 1000
          ).toLocaleString(),
          hash: transactionResponse.hash,
        };

        setLatestTransaction(transactionData);
        localStorage.setItem(
          "latest_transaction",
          JSON.stringify(transactionData)
        );
      } else {
        toast.error("Something went wrong, try reload the page.");
      }

      if (currentPage === 1) {
        getTransactionsPage(0, PAGE_SIZE);
      }
    } catch {
      toast.error("Failed to make transaction, please try again later.");
      setIsSending(false);
    }
  }, [formData, getEtheriumContract, currentPage, getTransactionsPage]);

  useEffect(() => {
    if (ethereum) {
      const checkIfWalletIsConnected = async () => {
        try {
          const account = await ethereum.request({
            method: "eth_accounts",
          });

          if (account.length) {
            setCurrentAccount(account[0]);
          }

          setIsLoadingAccount(false);
        } catch {
          toast.error("Something went wrong, try reload the page.");
        }
      };
      const handleAccountsChanged = (accounts: string[]) => {
        setCurrentAccount(accounts[0]);
      };

      checkIfWalletIsConnected();
      ethereum.on("accountsChanged", handleAccountsChanged);
      return () => {
        ethereum.removeListener("accountsChanged", handleAccountsChanged);
      };
    } else {
      setIsLoadingAccount(false);
      return alert("Please install and login to MetaMask first.");
    }
  }, [currentAccount]);

  return (
    <TransactionContext.Provider
      value={{
        connectWallet,
        isLoadingAccount,
        currentAccount,
        formData,
        handleChange,
        setFormData,
        sendTransaction,
        isSending,
        transactions,
        setTransactions,
        getTransactionsPage,
        totalPages,
        currentPage,
        PAGE_SIZE,
        setCurrentPage,
        isLoadingTransactionsHistory,
        getCurrentTransactionsPage,
        latestTransaction,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
}
