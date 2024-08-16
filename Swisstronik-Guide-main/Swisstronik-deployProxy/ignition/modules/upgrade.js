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
  })
}

async function main() {
  const [signer] = await ethers.getSigners()
  const SWTRProxy = await ethers.getContractAt('SWTRProxy', "0xF31300161E6c55Df2880c6d947dC32a986835a42")

  const SWTRImplementation = await ethers.deployContract('SWTRImplementation')
  await SWTRImplementation.waitForDeployment()
  console.log(`SWTRImplementation deployed to ${SWTRImplementation.target}`)

  const proxyAdmin = await ethers.getContractAt('ProxyAdmin', "0x823a05bB48e73C1B0c9621a460B26D4Ff7Ab6018")

  const tx = await sendShieldedTransaction(
    signer,
    proxyAdmin.target,
    proxyAdmin.interface.encodeFunctionData('upgradeTo', [
      SWTRProxy.target,
      SWTRImplementation.target,
    ]),
    '0'
  )

  const upgradeTx = await tx.wait();
  console.log("Tx hash:", upgradeTx.hash);
  console.log('Contract upgraded successfully!');
  console.log("Transaction hash: ", `https://explorer-evm.testnet.swisstronik.com/tx/${upgradeTx.hash}`);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
