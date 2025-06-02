import { useEffect, useState } from "react";
import { useTransactionContext } from "../context/useTransactionContext";
import TransactionCard from "./TransactionCard";
import Button from "./Button";

export default function Transactions() {
  const {
    transactions,
    getTransactionsPage,
    totalPages,
    PAGE_SIZE,
    currentPage,
    setCurrentPage,
  } = useTransactionContext();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (totalPages && currentPage >= totalPages) {
      setCurrentPage(totalPages);
    }

    window.history.pushState(null, "", `?page=${currentPage}`);

    (async () => {
      const startIndex = (currentPage - 1) * PAGE_SIZE;
      if (startIndex < 0) {
        setIsLoading(true);
        await getTransactionsPage(0, PAGE_SIZE);
        setIsLoading(false);
      } else {
        setIsLoading(true);
        await getTransactionsPage(startIndex, PAGE_SIZE);
        setIsLoading(false);
      }
    })();
  }, [currentPage, getTransactionsPage, totalPages, PAGE_SIZE, setCurrentPage]);

  return (
    <div className="card card-border bg-base-200 h-[90dvh] md:h-full p-5 space-y-2">
      <div className="card-title">Transactions history:</div>

      {!isLoading ? (
        <div className="flex flex-col gap-1 h-full overflow-y-auto">
          {transactions.map((transaction, i) => (
            <TransactionCard key={i} transaction={transaction} />
          ))}
        </div>
      ) : (
        <Skeletons count={10} />
      )}

      <div className="grid grid-cols-2 gap-2">
        <Button
          className=""
          onClick={() =>
            setCurrentPage((prev) => (prev === 1 ? prev : prev - 1))
          }
        >
          Previous
        </Button>
        <Button
          className=""
          onClick={() => setCurrentPage((prev) => prev + 1)}
          disabled={totalPages === null || currentPage >= totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

function Skeletons({ count }: { count: number }) {
  const divsToRender = Array.from({ length: count }, (_, index) => (
    <div
      key={index}
      className="card bg-base-100 min-h-[4.3rem] md:min-h-[4.33rem] animate-pulse"
    ></div>
  ));

  return (
    <div className=" flex flex-col gap-[0.35rem] h-full overflow-y-auto">
      {divsToRender}
    </div>
  );
}
