import { ChevronsRight, Copy, CopyCheck } from "lucide-react";
import { useTransactionContext } from "../context/useTransactionContext";
import Button from "./ui/Button";
import useCopyToclipboard from "../hooks/useCopyToClipboard";
import Address from "./Address";

export default function LastestTransaction() {
  const { latestTransaction } = useTransactionContext();
  const { copied, copyToClipboard } = useCopyToclipboard();

  return (
    <div className="card card-border p-5 bg-base-200 flex-grow">
      <div className="card-title">Latest transaction on this device:</div>
      <hr className="text-base-100 my-2" />
      {latestTransaction ? (
        <>
          <div className="flex gap-0.5 font-semibold">
            <Address address={latestTransaction.addressFrom} />
            <ChevronsRight size={16} className="mt-[0.3rem]" />
            <Address address={latestTransaction.addressTo} />
          </div>
          <div>
            Amount:{" "}
            <span className="font-semibold">{latestTransaction.amount}</span>{" "}
            ETH
          </div>
          <div>{latestTransaction.timestamp}</div>

          <hr className="text-base-100 mt-2 mb-1" />

          <div className="flex items-center justify-between">
            <div className="flex gap-1 max-w-[62%]">
              Hash:{" "}
              <a
                href={`https://sepolia.etherscan.io/tx/${latestTransaction.hash}`}
                target="_blank"
                rel="noopenner noreferrer"
                title="See transaction details on Etherscan"
                className="line-clamp-1 break-all"
              >
                <div className="font-semibold text-info hover:underline">
                  {latestTransaction.hash}
                </div>
              </a>
            </div>

            <Button
              title="Copy transaction hash to clipboard"
              className="btn-ghost"
              onClick={() => copyToClipboard(latestTransaction.hash)}
            >
              Copy hash
              {!copied ? <Copy size={15} /> : <CopyCheck size={15} />}
            </Button>
          </div>
        </>
      ) : (
        <p className="text-sm">
          No transaction data found. If you've completed a transaction, this
          information is saved locally and may have been cleared.
        </p>
      )}
    </div>
  );
}
