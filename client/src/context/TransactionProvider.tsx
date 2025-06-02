import { useCallback, useEffect, useState } from "react";
import { TransactionContext } from "./useTransactionContext";
import type { MainFormDataType, Transaction } from "../types/types";
import { contractABI, contractAddress } from "../utils/constants";
import { ethers, formatEther, parseEther, toQuantity } from "ethers";
import { BrowserProvider } from "ethers";
import type { Eip1193Provider } from "ethers";

const { ethereum } = window as typeof window & { ethereum?: Eip1193Provider };
const searchParams = new URLSearchParams(window.location.search);
const pageFromUrl = parseInt(searchParams.get("page") ?? "1", 10);

const PAGE_SIZE = 10;

export function TransactionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [currentPage, setCurrentPage] = useState(pageFromUrl);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [currentAccount, setCurrentAccount] = useState("");
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
      );

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
          console.log("Ethereum is not present");
        }
      } catch (error) {
        console.log(error);
      }
    },
    [getEtheriumContract]
  );

  const connectWallet = useCallback(async () => {
    try {
      if (!ethereum) return alert("Please install MetaMask");

      const accounts = await ethereum.request({ method: "eth_accounts" });
      if (accounts.length === 0) {
        alert("Please log in to MetaMask first.");
      }

      const account = await ethereum.request({
        method: "eth_requestAccounts",
      });

      setCurrentAccount(account[0]);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const sendTransaction = useCallback(async () => {
    try {
      if (!ethereum) return alert("Please install MetaMask");
      const transactionContract = await getEtheriumContract(ethereum);
      const { addressTo, amount } = formData;
      const parsedAmount = toQuantity(parseEther(amount));

      await ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: currentAccount,
            to: addressTo,
            gas: "0x5208",
            value: parsedAmount,
          },
        ],
      });

      const transactionHash = await transactionContract.addToBlockChain(
        addressTo,
        parsedAmount
      );

      setIsSending(true);
      console.log(`Loading - ${transactionHash.hash}`);
      await transactionHash.wait();
      setIsSending(false);
      console.log(`Success - ${transactionHash.hash}`);

      // refresh transactions history if currently on the first page
      if (currentPage === 1) {
        getTransactionsPage(0, PAGE_SIZE);
      }
    } catch (error) {
      console.log(error);
    }
  }, [
    currentAccount,
    formData,
    getEtheriumContract,
    currentPage,
    getTransactionsPage,
  ]);

  useEffect(() => {
    if (ethereum) {
      const checkIfWalletIsConnected = async () => {
        try {
          const account = await ethereum.request({
            method: "eth_accounts",
          });

          if (account.length) {
            setCurrentAccount(account[0]);
          } else {
            setCurrentAccount("");
          }
        } catch (error) {
          console.error(error);
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
      return alert("Please install MetaMask");
    }
  }, [currentAccount]);

  return (
    <TransactionContext.Provider
      value={{
        connectWallet,
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
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
}
