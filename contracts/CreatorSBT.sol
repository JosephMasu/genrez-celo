//SPDX-License-Identifier: MIT
// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract CreatorSBT is ERC721URIStorage, ERC721Burnable, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    // Mapping owner `address` to token ID
    mapping(address => uint) private _ownedToken;

    event ProfileMinted(
        uint indexed _tokenId,
        address indexed _owner,
        string artist,
        string uri
    );

    event ProfileUpdated(
        uint indexed _tokenId,
        string uri,
        string artist
    );

    event ProfileBurnt(
        uint indexed _tokenId
    );

    constructor() ERC721("Genrez Creator Soulbound Token", "zSBT") {}

    //mint a new SBT token for `msg.sender`
    function mintProfile(
        string memory _uri,
        string memory _artist
    ) public {
        require(msg.sender != address(0), "Invalid address");

        //prevent minting more than one membership nft
        require(
            balanceOf(msg.sender) == 0,
            "Minting more than one is not allowed"
        );

        _tokenIdCounter.increment();

        uint _tokenId = _tokenIdCounter.current();
        _safeMint(msg.sender, _tokenId);
        _setTokenURI(_tokenId, _uri);

        emit ProfileMinted(
            _tokenId,
            msg.sender,
            _artist,
            _uri
        );
    }

    //get profile uri for `address`
    function profileURI(address _owner) external view returns (string memory) {
        uint tokenId = _ownedToken[_owner];

        return tokenURI(tokenId);
    }

    //update token for msg.sender
    function updateProfile(string memory _uri, string memory _artist) public {
        uint _tokenId = _ownedToken[msg.sender];
        require(_exists(_tokenId), "You have no SBT minted");

        _setTokenURI(_tokenId, _uri);
        emit ProfileUpdated(_tokenId, _uri, _artist);
    }

    //burn token of `msg.sender`
    function burnProfile() external {
        uint _tokenId = _ownedToken[msg.sender];

        burn(_tokenId);
        emit ProfileBurnt(_tokenId);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint tokenId
    ) internal virtual override {
        super._beforeTokenTransfer(from, to, tokenId);

        // map token against owner address when sent from address 0
        if (from == address(0)) {
            _ownedToken[to] = tokenId;
        }

        if (to == address(0)) {
            delete _ownedToken[from];
        }
    }

    ///@dev specify overrides for multi inheritted functions in ERC721URIStorage, ERC721Burnable
    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenId);
    }

    //get uri for token ID
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    //return total number of SBTs
    function totalSupply() external view returns (uint) {
        return _tokenIdCounter.current();
    }
}
