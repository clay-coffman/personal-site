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
            <title>About</title>
          </Head>
          <Header />
          <p className="text-xl text-left mb-4 font-body">Coming soon...</p>
        </Container>
      </Layout>
    </>
  );
}
