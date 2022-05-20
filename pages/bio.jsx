import Container from "@/components/container";
import Header from "@/components/header";
import Layout from "@/components/layout";
import Head from "next/head";

export default function About() {
  return (
    <>
      <Layout>
        <Container>
          <Head>
            <title>Bio</title>
          </Head>
          <Header />
          <h1 className="text-4xl lg:text-6xl font-bold tracking-tighter leading-tight md:leading-none mb-12 text-center md:text-left">
            Bio
          </h1>
          <p className="md:text-xl md:text-left mb-4">Coming soon...</p>
        </Container>
      </Layout>
    </>
  );
}
