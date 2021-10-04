//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import "hardhat/console.sol";

contract TestTokenERC721Market is ReentrancyGuard {
  address payable Owner;
  struct TestTokenERC721 {
    string id;
  }

  constructor () {
    Owner = payable(msg.sender);
  }

  function fetchNFTs() public view returns (TestTokenERC721[] memory) {

  }
}