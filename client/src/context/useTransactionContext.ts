// separate file for vite fast reload to work

import { createContext, useContext } from "react";
import type { MainFormDataType, Transaction } from "../types/types";

interface TransactionContextType {
  connectWallet: () => Promise<void>;
  isLoadingAccount: boolean;
  currentAccount: string;
  formData: MainFormDataType;
  setFormData: React.Dispatch<React.SetStateAction<MainFormDataType>>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>, name: string) => void;
  sendTransaction: () => Promise<void>;
  isSending: boolean;
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  getTransactionsPage: (startIndex: number, pageSize: number) => Promise<void>;
  totalPages: number | null;
  PAGE_SIZE: number;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  isLoadingTransactionsHistory: boolean;
  getCurrentTransactionsPage: () => Promise<void>;
  latestTransaction:
    | (Transaction & {
        hash: string;
      })
    | null;
}

export const TransactionContext = createContext<TransactionContextType | null>(
  null
);

export function useTransactionContext() {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error(
      "useTransactionContext must be used within TransactionProvider"
    );
  }

  return context;
}
