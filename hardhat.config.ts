import { HardhatUserConfig } from "hardhat/config";
import "hardhat-gas-reporter";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  networks: {
    ganache: {
      url: "http://127.0.0.1:7545",
      chainId: 1337,
    },
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/w781dsB0TSA9_w3llC5off53YOLLEds6",
      accounts: [
        "a99f4660d343b6ee9c26f0972f19f603a632a3d79395b3abdeb506340a4816dd",
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
