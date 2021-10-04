import React, { useState, useEffect } from "react";
import { Card, CardContent, Typography, CardActions, Button, CircularProgress } from "@mui/material";
import axios from "axios";
import { baseMetadataURL, NFTResponse, NFT_DEPLOY_ADDRESS, NFT_AMOUNT } from "utils/utils";
import { TokenContent, NFTContent, CircularProgressContent } from "./styles";
import { ethers, Contract } from "ethers";
import TestNFTArtifacts from "artifacts/contracts/TestNFT.sol/TestNFT.json";

const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner(0);
const contract = new Contract(NFT_DEPLOY_ADDRESS, TestNFTArtifacts.abi, signer);

export default function NFT() {
  const [isLoading, checkLoading] = useState(true);
  const [NFTData, setNFTData] = useState<Array<NFTResponse>>([]);
  const [isBuyed, checkIsBuyed] = useState<Array<Boolean>>([]);
  const price = 0.003;

  const onFetchBuyed = async () => {
    let result: Array<Boolean> = [];
    for (let i=1; i<=NFT_AMOUNT; i++) {
      result.push(await contract.isExist(i));
    }

    checkIsBuyed(JSON.parse(JSON.stringify(result)));
  }

  const onMint = async (id: number) => {
    checkLoading(true);
    await contract.mintNFT(id, (baseMetadataURL + id).toString(), { value: ethers.utils.parseEther(price.toString()) });

    let result = isBuyed;
    result[id - 1] = true;
    checkIsBuyed(JSON.parse(JSON.stringify(result)));
    checkLoading(false);
  }

  useEffect(() => {
    const fetchData = async () => {
      await onFetchBuyed();
      let nft: Array<NFTResponse> = [];
      for (let i = 1; i <= NFT_AMOUNT; i++) {
        await axios.get(baseMetadataURL + i)
        .then(res => {
          let item: NFTResponse = res.data;
          nft.push({
            id: i,
            name: item.name,
            description: item.description,
            image: item.image,
            attributes: item.attributes,
          });
        });
      }
      setNFTData(nft);
      checkLoading(false);
    }

    fetchData();
  });

  return (
    <TokenContent>
      {
        (isLoading) ? (
          <CircularProgressContent>
            <CircularProgress />
          </CircularProgressContent>
        ) : (
          <NFTContent>
            {
              NFTData.map(item => (
                <Card sx={{ maxWidth: 345 }} key={item.id}>
                  <img
                    src={item.image}
                    loading="lazy"
                    width="250"
                  />
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">
                      Name: {item.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Description: {item.description}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Price: {price} ETH
                    </Typography>
                  </CardContent>
                  <CardActions style={{padding: "0 16px 16px 16px", justifyContent: "center"}}>
                    {
                      (!isBuyed[item.id - 1]) ? (
                        <Button
                          variant="contained"
                          disableElevation
                          onClick={() => onMint(item.id)}
                        >
                          Buy NFT
                        </Button>
                      ) : (
                        <Typography variant="h6" style={{color: "red"}}>
                          Buyed already
                        </Typography>
                      )
                    }
                  </CardActions>
                </Card>
              ))
            }
          </NFTContent>
        )
      }
    </TokenContent>
  )
}