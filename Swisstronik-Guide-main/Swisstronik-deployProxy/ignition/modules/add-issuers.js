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
  const [signer] = await ethers.getSigners()
  const contract = await ethers.getContractAt('SWTRImplementation', "0x241257577cD4212e82c56596aae1Aa574Db6C172")

  console.log('Adding new records...')

  const issuersToAdd = [
    {
      name: 'ZANNY',
      version: 1,
      address: '0x31c98ddc01d4e87a67a0f9e2c4333bdc6793bfeb',
    },
    {
      name: 'CCVUL',
      version: 1,
      address: '0x782414d67a82A7743D272e13A7E3117de913F20b',
    },
  ]

  const tx = await sendShieldedTransaction(
    signer,
    contract.target,
    contract.interface.encodeFunctionData('addIssuersRecord', [
      issuersToAdd.map((issuer) => issuer.name),
      issuersToAdd.map((issuer) => issuer.version),
      issuersToAdd.map((issuer) => issuer.address),
    ]),
    '0'
  )

  await tx.wait()

  console.log('Issuers added successfully!')
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
