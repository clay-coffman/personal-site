const axios = require("axios");
const throttledQueue = require("throttled-queue");

// create throttle for OS requests
const throttle = throttledQueue(2, 1000, true);

const etherscan_api_key = process.env.ETHERSCAN_API_KEY;
const opensea_api_key = process.env.OPENSEA_API_KEY;
const wallet_address = process.env.ETH_WALLET_ADDRESS;

// need a fn to getERC721Txs for wallet address
async function getERC721Transactions() {
  const account_address = wallet_address;
  const tokens = [];
  const request_url = `https://api.etherscan.io/api?module=account&action=tokennfttx&address=${account_address}&startblock=0&endblock=999999999&sort=asc&apikey=${etherscan_api_key}`;
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
// TODO add handling for 'null' response from api
async function getTokenImages(token_array) {
  const token_data = [];
  // for each token in token_array, construct url and request image
  // then append to image_urls, return this array
  //
  // add _.delay to avoid rate-limiting by OS
  await Promise.all(
    token_array.map((token) =>
      throttle(async () => {
        const request_url = `https://api.opensea.io/api/v1/asset/${token.contractAddress}/${token.tokenID}`;
        try {
          await axios
            .get(request_url, {
              headers: {
                "X-API-KEY": `${opensea_api_key}`,
              },
            })
            .then((res) => {
              // filiter out 404s
              if (res.status == 200) {
                token_data.push(res.data);
              }
            });
        } catch (error) {
          console.error(error);
        }
      })
    )
  );
  return token_data;
}

// TODO update this function with error handling
export async function getEthNfts() {
  try {
    // should return an array of image_urls
    // need to add at least some simple error handling...
    const token_data = await getERC721Transactions();
    // if (!token_data.ok) {
    //   throw new Error(
    //     `HTTP error in getERC721Transactions! status: ${token_data.status}`
    //   );
    // }
    // ^^ this doesn't work

    const tokens = await getTokenImages(token_data);
    // if (!image_urls.ok) {
    //   throw new Error(
    //     `HTTP error in getTokenImages! status: ${image_urls.status}`
    //   );

    return tokens;
  } catch (error) {
    console.error(error);
  }
}
