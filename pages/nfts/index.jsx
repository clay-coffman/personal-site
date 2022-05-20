import Head from "next/head";
import Header from "@/components/header";
import Container from "@/components/container";
import Layout from "@/components/layout";
import { getEthNfts } from "@/lib/ethereum";
import { getSolNfts } from "@/lib/solana";

const eth_wallet_address = "0xd85ac680059EA70cB322E358680F579538B8531C";

const sol_wallet_address = "";

export async function getStaticProps() {
  // get ethereum NFTs for wallet address
  const ethNFTs = await getEthNfts(eth_wallet_address);

  // get solana NFTs for wallet address
  // const solNFTs = await getSolNfts(sol_wallet_address);

  return { props: { ethNFTs } };
}

export default function NFTList({ ethNFTs }) {
  return (
    <>
      <Layout>
        <Container>
          <Head>
            <title>NFTs</title>
          </Head>
          <Header />
          <h1 className="text-4xl lg:text-6xl font-bold tracking-tighter leading-tight md:leading-none mb-12 text-center md:text-left">
            These are all my NFTs across various blockchains
          </h1>
          <p className="md:text-xl md:text-left mb-4">
            Some are on Solana, Ethereum, Wax, etc
          </p>
          <div className="p-10 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-5">
            {ethNFTs.map((nft) => (
              <p>{nft.id}</p>
            ))}
          </div>
        </Container>
      </Layout>
    </>
  );
}
