export function formatEthereumAddress(
  address: string,
  charsToShow: number = 4
): string {
  if (!address || address.length < charsToShow * 2 + 3) {
    return address;
  }

  const prefix = address.substring(0, charsToShow + 2);
  const suffix = address.substring(address.length - charsToShow);

  return `${prefix}...${suffix}`;
}

export const isValidEthereumAddress = (address: string): boolean => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};
