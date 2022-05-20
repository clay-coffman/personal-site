const address = "HommoWUj51rCmtcks5yds68GgL6kGLxDbQwaRoGtQ9DT";

import {
  resolveToWalletAddress,
  getParsedNftAccountsByOwner,
} from "@nfteyez/sol-rayz";

// const address = "3EqUrFrjgABCWAnqMYjZ36GcktiwDtFdkNYwY6C6cDzy;
// or use Solana Domain

export async function getURIs() {
  const nft_data = [];

  const publicAddress = await resolveToWalletAddress({
    text: address,
  });

  const nftArray = await getParsedNftAccountsByOwner({
    publicAddress,
  });

  nftArray.map((nft) => nft_data.push(nft.data));

  console.log(nft_data);
  return nft_data;
}
