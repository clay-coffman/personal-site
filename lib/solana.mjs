const address = process.env.SOL_WALLET_ADDRESS;

import axios from "axios";

import {
  resolveToWalletAddress,
  getParsedNftAccountsByOwner,
} from "@nfteyez/sol-rayz";

// TODO need to add better error handling and to handle null values in response
export async function getSolNfts() {
  const nft_data = [];

  const publicAddress = await resolveToWalletAddress({
    text: address,
  });

  // returns a uri that points to the token metadata
  const tokenURIs = await getParsedNftAccountsByOwner({
    publicAddress,
  });

  await Promise.all(
    tokenURIs.map(async (token) => {
      try {
        await axios.get(token.data.uri).then((res) => {
          // handle missing urls
          const image =
            typeof res.data.image == "undefined" ? "" : res.data.image;
          const external_url =
            typeof res.data.external_url == "undefined"
              ? ""
              : res.data.external_url;
          nft_data.push({
            name: res.data.name,
            image: image,
            external_url: external_url,
          });
        });
      } catch (error) {
        console.error(error);
      }
    })
  );

  // nftArray.map((nft) =>
  //   nft_data.push({ name: nft.data.name, uri: nft.data.uri })
  // );
  return nft_data;
}
