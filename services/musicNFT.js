/**
 * mint a music nft
 * @param {object} contract smartcontract instance
 * @param {string} address wallet address
 * @param {string} uri metadata uri
 * @returns 
 */
export async function mintMusic(contract, address, uri,  title, artist, feature){
   return await contract.methods.mintMusic(uri, title, artist, feature).send({from: address});
}

/**
 * get uri of token
 * @param {object} contract smartcontract instance
 * @param {number} tokenId token ID
 * @returns {string} metadata uri
 */
export async function getMusicNFTURI(contract, tokenId){
    return await contract.methods.tokenURI(tokenId).call();
}

/**
 * get the total number of token associated with address
 * @param {object} contract smartcontract instance
 * @param {string} address wallet address
 * @returns 
 */
export async function ownersTotalMusicNFT(contract, address) {
    return await contract.methods.balanceOf(address).call();
}

/**
 * get token associated with address at index
 * @param {object} contract smartcontract instance
 * @param {string} address wallet address
 * @param {Number} index token index
 * @returns 
 */
export async function getOwnerMusicNFT(contract, address, index) {
    return await contract.methods.tokenOfOwnerByIndex(address, index).call()
}

/**
 * get token associated with address at index
 * @param {object} contract smartcontract instance
 * @param {Number} index token index
 * @returns 
 */
export async function getMusicNFT(contract, index) {
    return await contract.methods.tokenByIndex(index).call()
}

/**
 * get the total number of tokens in the smart contract
 * @param {object} contract smartcontract instance
 * @returns {number} total number of nfts
 */
export async function totalMusicNFTs(contract){
    return await contract.methods.totalSupply().call();
}

/**
 * get the owner of a token
 * @param {object} contract smartcontract instance
 * @param {number} tokenId token ID
 * @returns {string} address of the token holder
 */
export async function getMusicNFTOwner(contract, tokenId){
    return await contract.methods.ownerOf(tokenId).call();
}