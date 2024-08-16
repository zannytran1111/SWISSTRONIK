const hre = require("hardhat");
const { encryptDataField, decryptNodeResponse } = require("@swisstronik/utils");

const sendShieldedTransaction = async (signer, destination, data, value) => {
  // Get the RPC link from the network configuration
  const rpcLink = hre.network.config.url;
  const [encryptedData] = await encryptDataField(rpcLink, data)

  return await signer.sendTransaction({
    from: signer.address,
    to: destination,
    data: encryptedData,
    value,
    gasLimit: 2000000,
    chainId: 1291,
  })
}

async function main() {
  const [signer] = await ethers.getSigners();
  const contract = await ethers.getContractAt('SWTRImplementation', "0x241257577cD4212e82c56596aae1Aa574Db6C172");

  console.log('Initializing owner...');

  const tx = await sendShieldedTransaction(signer, contract.target, contract.interface.encodeFunctionData('initialize', [signer.address]),0);

  await tx.wait();

  console.log(`Initialize owner successfully! current owner is ${signer.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
