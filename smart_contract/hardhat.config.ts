import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";

dotenv.config();

const getEnvVar = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing environment variable: ${name}. Please check your .env file.`
    );
  }
  return value;
};

const SEPOLIA_API_URL = getEnvVar("ALCHEMY_API_URL_SEPOLIA");
const ACCOUNT_PRIVATE_KEY = getEnvVar("ACCOUNT_PRIVATE_KEY");

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: SEPOLIA_API_URL,
      accounts: [ACCOUNT_PRIVATE_KEY],
    },
  },
};

export default config;
