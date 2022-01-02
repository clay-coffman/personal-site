import Head from "next/head";
import Image from "next/image";
import Header from "@/components/header";
import Container from "@/components/container";
import Layout from "@/components/layout";

// should extract all this two multiple components - photo grid and individual photo component

export default function Index() {
  return (
    <Layout>
      <Container>
        <Head>
          <title>Books</title>
        </Head>
        <Header />
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-5 p-10">
          <h1>fox.</h1>
          <Image
            objectFit="contain"
            layout="fill"
            src="https://images.unsplash.com/photo-1505783495551-523774fe88b4?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80"
            alt="A photo of a fox"
          />
        </div>
      </Container>
    </Layout>
  );
}
