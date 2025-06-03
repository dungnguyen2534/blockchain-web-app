import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { TransactionProvider } from "./context/TransactionProvider.tsx";
import { Toaster } from "sonner";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TransactionProvider>
      <App />
      <Toaster
        richColors
        position="top-center"
        icons={{
          success: null,
          info: null,
          warning: null,
          error: null,
          loading: null,
        }}
      />
    </TransactionProvider>
  </StrictMode>
);
