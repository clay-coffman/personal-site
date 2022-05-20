const address = process.env.SOL_WALLET_ADDRESS;

import {
  resolveToWalletAddress,
  getParsedNftAccountsByOwner,
} from "@nfteyez/sol-rayz";

// const address = "3EqUrFrjgABCWAnqMYjZ36GcktiwDtFdkNYwY6C6cDzy;
// or use Solana Domain

// TODO need to add better error handling and to handle null values in response
export async function getSolNfts() {
  const nft_data = [];

  const publicAddress = await resolveToWalletAddress({
    text: address,
  });

  const nftArray = await getParsedNftAccountsByOwner({
    publicAddress,
  });

  nftArray.map((nft) => nft_data.push(nft.data));

  return nft_data;
}
