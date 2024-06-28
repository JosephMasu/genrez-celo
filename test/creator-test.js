const {ethers} = require("hardhat");
const {expect} = require("chai");


describe("CreatorSBT", function(){
  let contract;
  let owner;
  let acc1;

  this.beforeEach( async function (){
    const sbtContract = await ethers.getContractFactory("CreatorSBT");
    
    [owner, acc1] = await ethers.getSigners();

    contract = await sbtContract.deploy();
  });

  it("Should return the right owner", async () => {
    expect(await contract.owner()).to.equal(owner.address);
  });


  it("Should mint one SBT NFT for acc1", async () => {
    expect(await contract.balanceOf(acc1.address)).to.equal(0);

    const tokenURI = "https://ipfs.infura.io/ipfs/QmWhQ5dBu7yDibjfWFhrXRF7v3tpENQyn6P4b9fgvVAVkH";
    const tx = await contract.connect(acc1).mintProfile(tokenURI);
    await tx.wait();

    expect(await contract.balanceOf(acc1.address)).to.equal(1);
  });

  it("Should prevent minting more than one SBT NFT for acc1", async () => {
    expect(await contract.balanceOf(acc1.address)).to.equal(0);

    const tokenURI = "https://ipfs.infura.io/ipfs/QmWhQ5dBu7yDibjfWFhrXRF7v3tpENQyn6P4b9fgvVAVkH";
    const tx1 = await contract.connect(acc1).mintProfile(tokenURI);
    await tx1.wait();

    expect(await contract.balanceOf(acc1.address)).to.equal(1);

    await expect(contract.connect(acc1).mintProfile(tokenURI)).to.be.revertedWith("Minting more than one is not allowed");
  });

  it("Should return the right token uri", async () => {
    await  expect(contract.profileURI(acc1.address)).to.be.revertedWith("ERC721URIStorage: URI query for nonexistent token");

    const tokenURI = "https://ipfs.infura.io/ipfs/QmWhQ5dBu7yDibjfWFhrXRF7v3tpENQyn6P4b9fgvVAVkH";
    const tx = await contract.connect(acc1).mintProfile(tokenURI);
    await tx.wait();

    expect(await contract.profileURI(acc1.address)).to.equal(tokenURI);
  });

  it("Should change token uri for acc1", async () => {
    expect(await contract.balanceOf(acc1.address)).to.equal(0);

    const tokenURI = "https://ipfs.infura.io/ipfs/QmWhQ5dBu7yDibjfWFhrXRF7v3tpENQyn6P4b9fgvVAVkH";
    const tx1 = await contract.connect(acc1).mintProfile(tokenURI);
    await tx1.wait();

    expect(await contract.profileURI(acc1.address)).to.equal(tokenURI);

    const tokenURI2 = "";
    const tx2 = await contract.connect(acc1).updateProfile(tokenURI2);
    await tx2.wait();

    expect(await contract.profileURI(acc1.address)).to.equal(tokenURI2);
  });

  it("Should remove token uri for acc1", async () => {
    expect(await contract.balanceOf(acc1.address)).to.equal(0);

    const tokenURI = "https://ipfs.infura.io/ipfs/QmWhQ5dBu7yDibjfWFhrXRF7v3tpENQyn6P4b9fgvVAVkH";
    const tx = await contract.connect(acc1).mintProfile(tokenURI);
    await tx.wait();

    const removeTx = await contract.connect(acc1).burnProfile();
    await removeTx.wait();

    expect(await contract.balanceOf(acc1.address)).to.equal(0);
    await expect(contract.connect(acc1).profileURI(acc1.address)).to.be.revertedWith("ERC721URIStorage: URI query for nonexistent token")

  })

})
