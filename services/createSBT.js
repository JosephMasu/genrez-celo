/**
 * get profile nft metadata for address
 * @param {object} contract smartcontract
 * @param {string} address wallet address
 * @returns {string}
 */
export const getOwnerProfileURI = async (contract, address) => {

    const profileURI = await contract.methods.profileURI(address).call();

    return profileURI;
}

/**
 * get profile nft metadata for address
 * @param {object} contract smartcontract
 * @param {string} address wallet address
 * @returns {string}
 */
export const getProfileURI = async (contract, tokenId) => {

    const profileURI = await contract.methods.tokenURI(tokenId).call();

    return profileURI;
}


/**
 * update profile nft with new uri for address
 * @param {object} contract smartcontract instance
 * @param {string} address wallet address
 * @param {string} uri metadata uri
 */
export const updateProfileURI = async (contract, address, uri, artist) => {

    await contract.methods.updateProfile(uri, artist).send({from : address});
}

/**
 * permanently burn profile nft for address 
 * @param {object} contract smartcontract instance
 * @param {string} address wallet address
 */
export const burnProfile = async (contract, address) => {

    await contract.methods.burnProfile().send({from : address});
}

/**
 * mint new profile nft for address
 * @param {object} contract smartcontract instance
 * @param {string} address wallet address 
 * @param {string} uri metadata uri
 */
export const mintProfile = async (contract, address, uri, artist) => {
    
    await contract.methods.mintProfile(uri, artist).send({from : address});

}

/**
 * get the total number of SBT profiles
 * @param {object} contract  smart contract connection instance
 * @returns {BigNumber}
 */
export const totalSupply = async (contract) => {
    return await contract.methods.totalSupply().call();
}

/**
 * 
 * @param {object} contract  smart contract connection instance
 * @param {Number} tokenId token ID
 * @returns 
 */
export const ownerOfProfile = async (contract, tokenId) => {
    return await contract.methods.ownerOf(tokenId).call();
}