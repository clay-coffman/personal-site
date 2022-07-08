import Head from "next/head";
import Header from "@/components/header";
import Container from "@/components/container";
import Layout from "@/components/layout";
import NFTCard from "@/components/nft-card";
import { getEthNfts } from "@/lib/ethereum";
import { getSolNfts } from "@/lib/solana";

export async function getStaticProps() {
  // get ethereum NFTs for wallet address
  const ethNFTs = await getEthNfts();

  const solNFTs = await getSolNfts();

  // get solana NFTs for wallet address
  // const solNFTs = await getSolNfts(sol_wallet_address);

  return { props: { ethNFTs, solNFTs } };
}

export default function NFTList({ solNFTs, ethNFTs }) {
  return (
    <>
      <Layout>
        <Container>
          <Head>
            <title>NFTs</title>
          </Head>
          <Header />
          <p className="font-body md:text-xl md:text-left mb-4">
            These are some of the NFTs I've accumulated over time. I say
            accumulated because you can't stop someone from sending you an
            NFT... so I didn't buy all of these. A lot are spam/junk I've been
            sent. And, frankly, I don't spend time in NFTs anymore so I'm not
            going to clean it up... This just seemed like a fun thing to code.
          </p>

          <h1 className="font-title italic text-3xl">Solana</h1>
          <div className="mx-auto grid grid-cols-1 md:grid-cols-4 gap-5">
            {solNFTs.map((nft) => (
              <NFTCard
                key={nft.name}
                permalink={nft.external_url}
                image_url={nft.image}
              />
            ))}
          </div>
          <h1 className="my-8 font-title italic text-3xl">Ethereum</h1>
          <div className="mx-auto grid grid-cols-1 md:grid-cols-4 gap-5">
            {ethNFTs.map((nft) => (
              <NFTCard
                key={nft.id}
                permalink={nft.permalink}
                image_url={nft.image_url}
              />
            ))}
          </div>
          <br></br>
        </Container>
      </Layout>
    </>
  );
}
