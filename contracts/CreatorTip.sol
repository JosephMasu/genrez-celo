//SPDX-License-Identifier: MIT;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./ICreatorSBT.sol";

pragma solidity 0.8.4;

contract CreatorTip is Ownable {
    address private _creatorSBTAddress;
    mapping(address => uint256) private tips;

    event CreatorTipped(
        address indexed _from,
        address indexed _to,
        uint amount
    );

    event CreatorWithdraw(
        address indexed _creator,
        address indexed _to,
        uint amount
    );
    
    constructor(address creatorSBTAddress) {
        _creatorSBTAddress = creatorSBTAddress;
    }

    //only allow a creator (holder of zSBT token)
    modifier onlyzSBTHolder(address _creator) {
        require(
            ICreatorSBT(_creatorSBTAddress).balanceOf(_creator) == 1,
            "Address is not a creator"
        );
        _;
    }

    // send funds to creator
    function tipCreator(address _creator)
        external
        payable
        onlyzSBTHolder(_creator)
    {
        require(msg.value > 0, "Amount must be greater than 0");

        tips[_creator] += msg.value;

        emit CreatorTipped(msg.sender, _creator, msg.value);
    }

    // withdraw creators funds
    function withdrawTip(address _to) external onlyzSBTHolder(msg.sender) {
        require(tips[msg.sender] > 0, "You dont have enough balance");

        uint amount = tips[msg.sender];

        tips[msg.sender] = 0;

        (bool sent, ) = _to.call{value: amount}("");

        require(sent, "Failed to withdraw");

        emit CreatorWithdraw(msg.sender, _to, amount);
    }

    //return balance of an address
    function balanceOf(address _address) public view onlyzSBTHolder(_address) returns (uint){
        return tips[_address];
    }

    receive() external payable {}

    fallback() external payable {}
}
