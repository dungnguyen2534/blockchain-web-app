import { ChevronsRight } from "lucide-react";
import type { Transaction } from "../types/types";
import formatEthereumAddress from "../utils/utils";

interface TransactionCardProps {
  transaction: Transaction;
}

export default function TransactionCard({ transaction }: TransactionCardProps) {
  return (
    <div className="flex flex-col gap-1 card card-border py-2 px-3 bg-base-100">
      <div className="flex gap-0.5 font-semibold">
        <a
          href={`https://sepolia.etherscan.io/address/${transaction.addressFrom}`}
          target="_blank"
          rel="noopenner noreferrer"
          title="See this address info on Etherscan"
        >
          <span className="text-info hover:underline">
            {formatEthereumAddress(transaction.addressFrom)}
          </span>
        </a>
        <ChevronsRight size={16} className="mt-[0.3rem]" />
        <a
          href={`https://sepolia.etherscan.io/address/${transaction.addressTo}`}
          target="_blank"
          rel="noopenner noreferrer"
          title="See this address info on Etherscan"
        >
          <span className="text-info hover:underline">
            {formatEthereumAddress(transaction.addressTo)}
          </span>
        </a>
      </div>

      <div className="flex justify-between">
        <div>
          Amount: <span className="font-semibold">{transaction.amount}</span>{" "}
          ETH
        </div>
        <div>{transaction.timestamp}</div>
      </div>
    </div>
  );
}
