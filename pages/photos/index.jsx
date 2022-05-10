import Head from "next/head";
import Header from "@/components/header";
import Container from "@/components/container";
import Layout from "@/components/layout";
import Gallery from "react-photo-gallery";

//import PhotoAlbum from "@/components/photo-album";

import { getAllPhotos } from "@/lib/flickr";

/* TODO
 * create an Album component that wraps a Gallery but allows
 * including a title as a prop (title being the name of the photoset)
 * use the new Album component here (should also allow synchronous fetching
 * of all albums + photos)
 */

export async function getStaticProps(context) {
  let photos = await getAllPhotos();
  //
  // need to get all photosets, then fetch photos
  // in parallel for each album to speed up load
  // let photosets = await getPhotosets();

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
        <Gallery photos={photos} />
      </Container>
    </Layout>
  );
}
