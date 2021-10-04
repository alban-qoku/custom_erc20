export const ERC20_DEPLOY_ADDRESS = "0x82583689c1d7A36DEb8106Dabae5BC7493d169E5";
export const NFT_DEPLOY_ADDRESS = "0x40C8F0FBBcC033bEb8261590F7B4972b33cd6066";
export const NFT_API_URL = "https://ropsten.infura.io/v3/7134c41c50a14f858319a0ac7a5959ff";
export const GAS_FEE = "2000000000";
export const baseMetadataURL = "https://gateway.pinata.cloud/ipfs/QmUzMqXQ1GAxanX82pK7DbMYi7qpf8AX1nX9AX6xEzBc5y/";
export const NFT_AMOUNT = 12;
export const Pages = [
  "ERC20 Token",
  "NFT",
];
export interface NFTResponse {
  id: number;
  name: string;
  description: string;
  image: string;
  attributes: Array<Object>;
}