import Transactions from "./components/Transactions";
import TransactionForm from "./components/TransactionForm";

function App() {
  return (
    <main
      className="min-h-screen grid place-items-center bg-base-100 overflow-x-hidden"
      data-theme="dark"
    >
      <div className="w-[90%] lg:w-[80%] flex flex-col lg:flex-row gap-3 lg:h-[75dvh] justify-between">
        <div className="w-full lg:min-w-[20rem] lg:w-[40rem]">
          <TransactionForm />
        </div>
        <div className="w-full">
          <Transactions />
        </div>
      </div>
    </main>
  );
}

export default App;
