import { HardhatUserConfig } from "hardhat/config";
import "hardhat-gas-reporter";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  networks: {
    ganache: {
      url: "localhost",
      chainId: 1337,
    },
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/",
      accounts: [
        "",
      ],
    },
  },
  gasReporter: {
    currency: "USD",
    L1: "ethereum",
    outputFile: "gas-report.txt",
    enabled: true,
  },
};

export default config;
