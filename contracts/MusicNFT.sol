//SPDX-License-Identifier: MIT
// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./ICreatorSBT.sol";

contract MusicNFT is ERC721Enumerable, ERC721URIStorage {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;
    ICreatorSBT private CreatorSBT;

    event MusicMinted(
        uint indexed _tokenId,
        address indexed _owner,
        string uri,
        string title,
        string artist,
        string feature
    );

    event MusicBurnt(uint indexed _tokenId);

    constructor(address CreatorSBTAddress) ERC721("Genrez Music NFT", "zMT") {
        CreatorSBT = ICreatorSBT(CreatorSBTAddress);
    }

    // allow only zSBT holders
    modifier onlyzSBTHolder() {
        require(CreatorSBT.balanceOf(msg.sender) == 1, "You need to mint zSBT");
        _;
    }

    function mintMusic(
        string calldata uri,
        string memory _title,
        string memory _artist,
        string memory _feature
    ) external onlyzSBTHolder {
        _tokenIdCounter.increment();

        uint tokenId = _tokenIdCounter.current();

        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, uri);

        emit MusicMinted(tokenId, msg.sender, uri, _title, _artist, _feature);
    }

    ///@dev specify overrides for multi inheritted functions in ERC721Enumerable, ERC721URIStorage
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint tokenId
    ) internal virtual override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenId);

        emit MusicBurnt(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
}
