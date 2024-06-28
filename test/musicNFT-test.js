const {ethers} = require("hardhat");
const {expect} = require("chai");

describe("MusicNFT", function(){
    let musicContract;
    let creatorSBTContract;
    let owner;
    let acc1

    this.beforeEach(async () => {
        const musicNFTContract = await ethers.getContractFactory("MusicNFT");
        const creatorContract = await ethers.getContractFactory("CreatorSBT");

        creatorSBTContract = await creatorContract.deploy();

        [owner, acc1] = await ethers.getSigners();

        musicContract = await musicNFTContract.deploy(creatorSBTContract.address);
        
        
    });

    it("should mint a music nft with zSBT held by account", async () => {
        expect(await musicContract.balanceOf(acc1.address)).to.equal(0);
        expect(await creatorSBTContract.balanceOf(acc1.address)).to.equal(0);

        const tokenURI = "";
        await creatorSBTContract.connect(acc1).mintProfile(tokenURI);

        expect(await creatorSBTContract.balanceOf(acc1.address)).to.equal(1);

        const musicTokenUri = "";
        await musicContract.connect(acc1).mintMusic(musicTokenUri);

        expect(await musicContract.balanceOf(acc1.address)).to.equal(1);
    });

    it("should not mint a music nft without zSBT token held by account", async() => {
        expect(await musicContract.balanceOf(acc1.address)).to.equal(0);
        expect(await creatorSBTContract.balanceOf(acc1.address)).to.equal(0);

        const musicTokenUri = "";
        
        await expect( musicContract.connect(acc1).mintMusic(musicTokenUri)).to.revertedWith("You need to mint zSBT");
    })
})