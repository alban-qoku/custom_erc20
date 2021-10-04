import React, { useState } from "react";
import { Button, Typography, TextField, CircularProgress } from "@mui/material";
import { ethers, Contract } from "ethers";
import TestTokenERC20Artifacts from "artifacts/contracts/TestTokenERC20.sol/TestTokenERC20.json";
import { TokenContent, Section, Right, CircularProgressContent } from "./styles";
import { ERC20_DEPLOY_ADDRESS, GAS_FEE } from "utils/utils";

declare global {
  interface Window {
    ethereum: ethers.providers.ExternalProvider;
  }
}

export default function ERC20Token() {
  const [isLoading, checkLoading] = useState(false);
  const [mintStatus, setMintStatus] = useState(false); // Status to set sales permission
  const [testTokenERC20Name, setTestTokenERC20Name] = useState(""); // Test ERC20 Token's Name
  const [testTokenERC20Symbol, setTestTokenERC20Symbol] = useState(""); // Test ERC20 Token's Symbol
  const [swapRate, setSwapRate] = useState(0); // Swap rate with Ether
  const [currentTestBalance, setCurrentTestBalance] = useState(0); // Current Test ERC20 Token's Balance
  const [currentEtherBalance, setCurrentEtherBalance] = useState(0); // Current Ether's Balance
  const [buyAmount, setBuyAmount] = useState(0); // Amount of ERC20 tokens to buy
  const [recipientAddress, setRecipientAddress] = useState("0xb16BfE3c7A108C1924EAc2aa958d33Bc6ba6fDB9"); // Address to send tokens
  const [recipientAmount, setRecipientAmount] = useState(0); // Amount of ERC20 tokens to send

  // request access to the user's MetaMask account
  async function requestAccount() {
    if (window.ethereum?.request)
      return window.ethereum.request({ method: "eth_requestAccounts" });

    throw new Error(
      "Missing install Metamask. Please access https://metamask.io/ to install extension on your browser"
    );
  }

  // function for fetch data
  const onFetchData = async () => {
    checkLoading(true);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new Contract(ERC20_DEPLOY_ADDRESS, TestTokenERC20Artifacts.abi, signer);
    const [address] = await requestAccount();
    setCurrentEtherBalance(Number(ethers.utils.formatEther(await provider.getBalance(address))));
    try {
      setTestTokenERC20Name(await contract.name());
      setTestTokenERC20Symbol(await contract.symbol());
      setSwapRate(Number(await contract.swapRate()));
      setCurrentTestBalance(Number(await contract.balanceOf(address)));
    } catch (err) {
      console.log(`Error: ${err}`);
    }
    checkLoading(false);
  }

  // function for change the mint permission
  const onChangeMintStatus = async () => {
    if (!mintStatus) {
      await onFetchData();
    }
    setMintStatus(!mintStatus);
  };

  // function for buy tokens
  const onMint = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner(0);
    const contract = new Contract(ERC20_DEPLOY_ADDRESS, TestTokenERC20Artifacts.abi, signer);
    const ether_amount = buyAmount / swapRate;
    checkLoading(true);
    if (currentEtherBalance > ether_amount) {
      try {
        await contract.buy(buyAmount, { value: ethers.utils.parseEther(ether_amount.toString()) });
        await onFetchData();
        setCurrentEtherBalance(currentEtherBalance - ether_amount);
        setCurrentTestBalance(currentTestBalance + buyAmount);
        setBuyAmount(0);
      } catch (err) {
        console.log(err);
      }
    } else {
      alert("Not enough Test Token in your wallet!");
    }
    checkLoading(false);
  };

  // function for send tokens
  const onSend = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner(0);
    const contract = new Contract(ERC20_DEPLOY_ADDRESS, TestTokenERC20Artifacts.abi, signer);
    checkLoading(true);
    if (currentTestBalance > recipientAmount) {
      try {
        await contract["transfer(address,uint256)"](recipientAddress, recipientAmount, { gasPrice: GAS_FEE });
        await onFetchData();
        setCurrentTestBalance(currentTestBalance - recipientAmount);
        setRecipientAmount(0);
      } catch (err) {
        console.log(err);
      }
    } else {
      alert("Not enough Test Token in your wallet!");
    }
    checkLoading(false);
  };

  return (
    <TokenContent>
      {
        (isLoading) ? (
          <CircularProgressContent>
            <CircularProgress />
          </CircularProgressContent>
        ) : (
          <>
            <Section>
              <Typography>Sales Permission: {mintStatus ? "True" : "False"}</Typography>
            </Section>
            <Right>
              <Button
                variant="contained"
                disableElevation
                onClick={onChangeMintStatus}
              >
                {mintStatus ? "Stop Sale" : "Start Sale"}
              </Button>
            </Right>

            {
              (mintStatus) && (
                <>
                  <Section>
                    <Typography>Current {testTokenERC20Name}'s Balance:</Typography>
                    <Typography>{currentTestBalance} {testTokenERC20Symbol}</Typography>
                  </Section>

                  <Section>
                    <Typography>Current Ether's Balance:</Typography>
                    <Typography>{currentEtherBalance} ETH</Typography>
                  </Section>

                  <Section>
                    <Typography>Buy Tokens: </Typography>
                    <TextField
                      id="standard-basic"
                      type="number"
                      label="Token's Amount"
                      variant="standard"
                      value={buyAmount}
                      onChange={(e) => setBuyAmount(+e.target.value)}
                    />
                  </Section>
                  
                  <Right>
                    <Button
                      variant="contained"
                      disableElevation
                      onClick={onMint}
                    >
                      Buy Tokens ({Number(buyAmount / swapRate)} ETH)
                    </Button>
                  </Right>

                  <Section>
                    <Typography>Recipient Address: </Typography>
                    <TextField
                      id="standard-basic"
                      label="Recipient Address"
                      variant="standard"
                      value={recipientAddress}
                      onChange={(e) => setRecipientAddress(e.target.value)}
                    />
                  </Section>

                  <Section>
                    <Typography>Recipient Amount: </Typography>
                    <TextField
                      id="standard-basic"
                      type="number"
                      label="Recipient Amount"
                      variant="standard"
                      value={recipientAmount}
                      onChange={(e) => setRecipientAmount(+e.target.value)}
                    />
                  </Section>
                  
                  <Right>
                    <Button
                      variant="contained"
                      disableElevation
                      onClick={onSend}
                    >
                      Send Tokens
                    </Button>
                  </Right>
                </>
              )
            }
          </>
        )
      }
    </TokenContent>
  );
}
