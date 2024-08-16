require("@nomicfoundation/hardhat-toolbox");
//require("dotenv").config();

module.exports = {
  defaultNetwork: "swisstronik",
  solidity: "0.8.20",
  networks: {
    swisstronik: {
      // If you're using local testnet, replace `url` with local json-rpc address
      url: "https://json-rpc.testnet.swisstronik.com/",
      accounts: ["0xec3e99e2cc59f65c94c82600f7137d5b75e5032b254ee23c1333a6a36904aa5e"],
    },
  },
etherscan: {
    apiKey: `ANY_STRING_WILL_DO`,
    customChains: [
      {
        network: 'swisstronik',
        chainId: 1291,
        urls: {
          apiURL: 'https://explorer-evm.testnet.swisstronik.com/api',
          browserURL: 'https://explorer-evm.testnet.swisstronik.com',
        },
      },
    ],
  },
};