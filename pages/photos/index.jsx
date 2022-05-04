import Head from "next/head";
import Gallery from "react-photo-gallery";
import Header from "@/components/header";
import Container from "@/components/container";
import Layout from "@/components/layout";

import { getAllPhotos } from "../../lib/flickr";

export async function getStaticProps(context) {
  let photos = await getAllPhotos();

  return { props: { photos } };
}

export default function Index({ photos }) {
  return (
    <Layout>
      <Container>
        <Head>
          <title>Photos</title>
        </Head>
        <Header />
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-5 p-10"></div>
        <Gallery photos={photos} />
      </Container>
    </Layout>
  );
}
