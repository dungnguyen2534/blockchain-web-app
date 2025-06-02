import hre from "hardhat";

async function main() {
  const Transactions = await hre.ethers.getContractFactory("Transactions");
  const transactions = await Transactions.deploy();

  console.log("Transactions deployed to: ", transactions.target);
}

async function runMain() {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

runMain();
// npx hardhat run scripts/deploy.ts --network sepolia
