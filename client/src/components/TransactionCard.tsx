import { ChevronsRight } from "lucide-react";
import type { Transaction } from "../types/types";
import Address from "./Address";

interface TransactionCardProps {
  transaction: Transaction;
}

export default function TransactionCard({ transaction }: TransactionCardProps) {
  return (
    <div className="flex flex-col gap-0.5 card card-border py-2 px-3 bg-base-100">
      <div className="flex gap-0.5 font-semibold">
        <Address address={transaction.addressFrom} />
        <ChevronsRight size={16} className="mt-[0.3rem]" />
        <Address address={transaction.addressTo} />
      </div>

      <div className="flex flex-col sm:flex-row gap-0.5 justify-between">
        <div>
          Amount: <span className="font-semibold">{transaction.amount}</span>{" "}
          ETH
        </div>
        <div>{transaction.timestamp}</div>
      </div>
    </div>
  );
}
