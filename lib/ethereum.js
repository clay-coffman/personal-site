const axios = require("axios");
const throttledQueue = require("throttled-queue");

// create throttle for OS requests
const throttle = throttledQueue(3, 1000, true);

// const etherscan_api_key = process.env.ETHERSCAN_API_KEY;
// const account_address = process.env.ETH_WALLET_ADDRESS;
//
const etherscan_api_key = "1YKJT2WEF5BUVS5W4BD2H7UEPRUVUCDV2K";
const account_address = "0xd85ac680059EA70cB322E358680F579538B8531C";

// need a fn to getERC721Txs for wallet address
async function getERC721Transactions(account_address) {
  let tokens = [];
  let request_url = `https://api.etherscan.io/api?module=account&action=tokennfttx&address=${account_address}&startblock=0&endblock=999999999&sort=asc&apikey=${etherscan_api_key}`;
  try {
    let response = await axios.get(request_url);
    // for each token, create token object and add to tokens arr
    for (let token of response.data.result) {
      let token_data = {
        contractAddress: token.contractAddress,
        tokenID: token.tokenID,
      };
      tokens.push(token_data);
    }
  } catch (error) {
    console.log("error getting tokens from etherescan");
  }
  return tokens;
}

// need a fn to get TokenImages from OpenSea
// using the contractAddress and tokenId from getERC721Transactions
// TODO - add delay - getting rate-limited by OS API
async function getTokenImages(token_array) {
  const image_urls = [];
  // for each token in token_array, construct url and request image
  // then append to image_urls, return this array
  //
  // add _.delay to avoid rate-limiting by OS
  await Promise.all(
    token_array.map((token) =>
      throttle(async () => {
        const request_url = `https://api.opensea.io/api/v1/asset/${token.contractAddress}/${token.tokenID}`;
        await axios
          .get(request_url, {
            headers: {
              "X-API-KEY": "85d474a6813440c0ab3000d72cdb8ec4",
            },
          })
          .then((res) => {
            console.log(res.data.image_url);
            image_urls.push(res.data.image_url);
          });
      })
    )
  );
  return image_urls;
}

async function getGalleryImages(account_address) {
  try {
    // should return an array of image_urls
    // need to add at least some simple error handling...
    let token_data = await getERC721Transactions(account_address);
    // if (!token_data.ok) {
    //   throw new Error(
    //     `HTTP error in getERC721Transactions! status: ${token_data.status}`
    //   );
    // }
    // ^^ this doesn't work

    let image_urls = await getTokenImages(token_data);
    // if (!image_urls.ok) {
    //   throw new Error(
    //     `HTTP error in getTokenImages! status: ${image_urls.status}`
    //   );
    // }

    return image_urls;
  } catch (error) {
    console.error(error);
  }
}

getGalleryImages(account_address);
