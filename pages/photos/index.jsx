import React, { useCallback } from "react";
import Head from "next/head";
import Header from "@/components/header";
import Container from "@/components/container";
import Layout from "@/components/layout";
import Gallery from "react-photo-gallery";
import Image from "@/components/image";

//import PhotoAlbum from "@/components/photo-album";

import { getAllPhotos } from "@/lib/flickr";

/* TODO
 * create an Album component that wraps a Gallery but allows
 * including a title as a prop (title being the name of the photoset)
 * use the new Album component here (should also allow synchronous fetching
 * of all albums + photos)
 */

export async function getStaticProps() {
  let photos = await getAllPhotos();
  //
  // need to get all photosets, then fetch photos
  // in parallel for each album to speed up load
  // let photosets = await getPhotosets();

  return { props: { photos } };
}

export default function Index({ photos }) {
  const imageRenderer = useCallback(({ photo }) => <Image photo={photo} />);
  return (
    <Layout>
      <Container>
        <Head>
          <title>Photos</title>
        </Head>
        <Header />
        <p className="font-body text-sm md:text-xl md:text-left mb-4">
          These are some pictures I&apos;ve taken throughout the years. They are
          being synced over via Flickr&apos;s API, so if it&apos;s broken... let
          me know.
        </p>
        <Gallery photos={photos} renderImage={imageRenderer} />
      </Container>
    </Layout>
  );
}
