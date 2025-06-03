import { useTransactionContext } from "../context/useTransactionContext";
import thereumIcon from "../assets/svg/ethereum-svgrepo-com.svg";
import Button from "./ui/Button";
import { Copy, CopyCheck, Palette, PlugZap } from "lucide-react";
import useCopyToclipboard from "../hooks/useCopyToClipboard";
import { formatEthereumAddress } from "../utils/utils";
import ThemeList from "./ui/ThemeList";

export default function UserCard() {
  const { connectWallet, currentAccount, isLoadingAccount } =
    useTransactionContext();
  const { copied, copyToClipboard } = useCopyToclipboard();

  const openThemeModal = () => {
    if (document) {
      (document.getElementById("theme_list") as HTMLFormElement).showModal();
    }
  };

  return (
    <div className="card card-border h-28 space-y-3 p-5 bg-base-200 bg-gradient-to-br from-primary via-secondary to-accent">
      <div className="relative">
        <div className="space-y-4">
          <div className="flex gap-2 items-center">
            <img className="h-8 w-8" src={thereumIcon} alt="" />
            <span className="font-semibold text-xl text-primary-content">
              Ethereum
            </span>
          </div>
          <div>
            <div>
              {!isLoadingAccount ? (
                <>
                  {currentAccount ? (
                    <>
                      <div className="text-primary-content">
                        Address:{" "}
                        <a
                          href={`https://sepolia.etherscan.io/address/${currentAccount}`}
                          target="_blank"
                          rel="noopenner noreferrer"
                          title="See your info on Etherscan"
                          className="font-semibold text-info hover:underline"
                        >
                          {formatEthereumAddress(currentAccount)}
                        </a>
                      </div>
                    </>
                  ) : (
                    <Button
                      className="btn-link text-primary-content"
                      onClick={connectWallet}
                    >
                      <div className="flex gap-1 items-center mb-3">
                        <PlugZap size={20} className="-ml-2 mb-1" /> Connect
                        wallet
                      </div>
                    </Button>
                  )}
                </>
              ) : (
                <div className="space-x-1 ml-3">
                  <span className="loading loading-ring loading-sm"></span>
                  <span className="loading loading-ring loading-sm"></span>
                  <span className="loading loading-ring loading-sm"></span>
                  <span className="loading loading-ring loading-sm"></span>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 absolute right-0 top-0">
          <Button
            title="Change theme"
            className="btn-square btn-circle w-8 h-8"
            onClick={openThemeModal}
          >
            <Palette size={16} />
          </Button>
          <ThemeList />

          {currentAccount && (
            <Button
              title="Copy address to clipboard"
              className="btn-square w-8 h-8"
              onClick={() => copyToClipboard(currentAccount)}
            >
              {!copied ? <Copy size={16} /> : <CopyCheck size={16} />}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
