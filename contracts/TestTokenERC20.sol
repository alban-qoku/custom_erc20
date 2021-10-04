//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TestTokenERC20 is ERC20 {
  uint SwapRate = 1000;
  address Owner;

  constructor(uint256 initialSupply) ERC20("ERC20 Test Token", "ETT20") {
    Owner = msg.sender;
    _mint(msg.sender, initialSupply);
    decimals();
  }

  function decimals() public view virtual override returns (uint8) {
    return 0;
  }

  function swapRate() public view returns (uint) {
    return SwapRate;
  }

  function buy(uint256 _amount) public payable {
    _transfer(Owner, msg.sender, _amount);
  }
}
