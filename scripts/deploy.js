// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // // We get the contract to deploy
  // const Greeter = await hre.ethers.getContractFactory("Greeter");
  // const greeter = await Greeter.deploy("Hello, Hardhat!");
  // await greeter.deployed();
  // console.log("Greeter deployed to:", greeter.address);

  // Deploy ERC20 Token
  const TestTokenERC20 = await hre.ethers.getContractFactory("TestTokenERC20");
  const testTokenERC20 = await TestTokenERC20.deploy(1000000);
  await testTokenERC20.deployed();
  console.log("TestTokenERC20 deployed to: ", testTokenERC20.address);

  // // Deploy NFT Token
  // const TestNFT = await hre.ethers.getContractFactory("TestNFT");
  // const testNFT = await TestNFT.deploy();
  // await testNFT.deployed();
  // console.log("TestNFT deployed to: ", testNFT.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
