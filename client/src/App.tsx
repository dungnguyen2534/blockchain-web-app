import Transactions from "./components/Transactions";
import TransactionForm from "./components/TransactionForm";
import UserCard from "./components/UserCard";
import LastestTransaction from "./components/LastestTransaction";
import { useEffect } from "react";
import { themeChange } from "theme-change";

function App() {
  useEffect(() => {
    themeChange(false);
  }, []);

  return (
    <main className="min-h-screen grid place-items-center bg-base-100 overflow-x-hidden py-5">
      <div className="w-[90%] lg:w-[80%] flex flex-col lg:flex-row gap-3 lg:h-[35rem] justify-between">
        <div className="w-full lg:min-w-[20rem] lg:w-[40rem] flex flex-col gap-3">
          <UserCard />
          <TransactionForm />
          <LastestTransaction />
        </div>
        <div className="w-full">
          <Transactions />
        </div>
      </div>
    </main>
  );
}

export default App;
