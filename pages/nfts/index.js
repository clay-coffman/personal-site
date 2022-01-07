import Head from "next/head";
import Header from "@/components/header";
import Container from "@/components/container";
import Layout from "@/components/layout";

// need to have a getNFTs function
// export async function getStaticProps(context) {
//   const books = await getBooks();

//   return { props: { books } };
// }

export default function NFTList() {
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
        </Container>
      </Layout>
    </>
  );
}
