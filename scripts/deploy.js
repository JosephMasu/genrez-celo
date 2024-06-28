const { ethers, artifacts } = require("hardhat");

async function main() {
  const CreatorSBTContract = await ethers.getContractFactory("CreatorSBT");
  const MusicNFTContract = await ethers.getContractFactory("MusicNFT");
  const CreatorTipContract = await ethers.getContractFactory("CreatorTip");

  const deployedCreatorSBTContract = await CreatorSBTContract.deploy();
  const deployedMusicNFTContract = await MusicNFTContract.deploy(
    deployedCreatorSBTContract.address
  );
  const deployedCreatorTipContract = await CreatorTipContract.deploy(
    deployedCreatorSBTContract.address
  );

  await Promise.all([
    deployedCreatorSBTContract.deployed(),
    deployedMusicNFTContract.deployed(),
    deployedCreatorTipContract.deployed()
  ]);

  //verifiy contract

  storeContractData(deployedCreatorSBTContract, "CreatorSBT");
  storeContractData(deployedMusicNFTContract, "MusicNFT");
  storeContractData(deployedCreatorTipContract, "CreatorTip");

  console.log("CreatorSBT Contract deployed to: ", deployedCreatorSBTContract.address);
  console.log("MusicNFT Contract deployed to: ", deployedMusicNFTContract.address);
  console.log("CreatorTip Contract deployed to: ", deployedCreatorTipContract.address);
}

const storeContractData = (contract, contractName) => {
  const fs = require("fs");
  const contractDir = `${__dirname}/../abis`;

  if (!fs.existsSync(contractDir)) {
    fs.mkdirSync(contractDir);
  }

  const contractArtiacts = artifacts.readArtifactSync(contractName);

  fs.writeFileSync(
    contractDir + `/${contractName}.json`,
    JSON.stringify({ address: contract.address, ...contractArtiacts }, null, 2)
  );
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
