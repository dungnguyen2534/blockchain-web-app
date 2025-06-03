import { formatEthereumAddress } from "../utils/utils";

interface AddressProps {
  address: string;
  className?: string;
}

export default function Address({ address, className }: AddressProps) {
  return (
    <a
      href={`https://sepolia.etherscan.io/address/${address}`}
      target="_blank"
      rel="noopenner noreferrer"
      title="See this address info on Etherscan"
      className={className}
    >
      <span className="text-info hover:underline">
        {formatEthereumAddress(address)}
      </span>
    </a>
  );
}
