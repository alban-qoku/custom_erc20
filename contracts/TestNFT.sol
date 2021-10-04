//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "hardhat/console.sol";

contract TestNFT is ERC721URIStorage {
  address contractAddress;
  using Counters for Counters.Counter;
  Counters.Counter private TokenIds;

  constructor() ERC721("Test NFT", "TNFT") {
    
  }

  function mintNFT(uint tokenId, string memory tokenURI) public payable {
    _mint(msg.sender, tokenId);
    _setTokenURI(tokenId, tokenURI);
  }

  function isExist(uint tokenId) view public returns (bool) {
    bool Exist = _exists(tokenId);
    return Exist;
  }
}