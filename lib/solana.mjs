const address = process.env.SOL_WALLET_ADDRESS;

import axios from "axios";

import {
  resolveToWalletAddress,
  getParsedNftAccountsByOwner,
} from "@nfteyez/sol-rayz";

// helper function to get token data from URI
async function getTokenData(uri) {
  try {
    const res = await axios.get(uri);
    // need to check for error and not return it
    if (res) {
      // TODO this is trash, improve this
      const name = res.data.name;
      const image = res.data.image;
      const external_url = res.data.external_url;

      // this is probably a better solution
      // check to see if all props exist for token
      // if (name && image && external_url) {
      //   return {
      //     name: name,
      //     image: image,
      //     external_url: external_url
      //   };
      // }

      const token_obj = {
        name: !name ? "" : name,
        image: !image ? "" : image,
        external_url: !external_url ? "" : external_url,
      };

      return token_obj;
    } else {
      throw new Error("error getting token metadata");
    }
  } catch (error) {
    console.error(error);
  }
}

// gets the tokenURIs
async function getTokenURIs() {
  try {
    // resolve address
    const publicAddress = await resolveToWalletAddress({
      text: address,
    });

    // returns a list of URIs that point to the token metadata
    const tokenURIs = await getParsedNftAccountsByOwner({
      publicAddress,
    });
    return tokenURIs;
  } catch (error) {
    console.error(error);
  }
}

// TODO need to add better error handling and to handle null values in response
export async function getSolNfts() {
  const tokens = [];
  // get tokenURIs
  const tokenURIs = await getTokenURIs();

  // map through uris and fetch token metadata for each uri
  await Promise.all(
    tokenURIs.map(async (token_uri) => {
      const token_data = await getTokenData(token_uri.data.uri);
      if (token_data) {
        tokens.push(token_data);
      }
    })
  );
  return tokens;
}
