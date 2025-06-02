import type { Eip1193Provider } from "ethers";

/* eslint-disable */
interface MetaMaskEthereumProvider extends Eip1193Provider {
  on: (eventName: string, listener: (...args: any[]) => void) => void;
  removeListener: (
    eventName: string,
    listener: (...args: any[]) => void
  ) => void;
}

declare global {
  interface Window {
    ethereum?: MetaMaskEthereumProvider;
  }
}
