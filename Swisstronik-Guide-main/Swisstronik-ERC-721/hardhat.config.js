require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.20",
  networks: {
    swisstronik: {
      url: "https://json-rpc.testnet.swisstronik.com/", //URL of the RPC node for Swisstronik.
      //2nd wallet
      accounts: ["0xec3e99e2cc59f65c94c82600f7137d5b75e5032b254ee23c1333a6a36904aa5e"],
	//Make sure you have enough funds in this wallet to deploy the smart contract
    },
  },
};