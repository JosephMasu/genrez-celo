//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

interface ICreatorSBT {
    function balanceOf(address owner) external view returns (uint256);
}