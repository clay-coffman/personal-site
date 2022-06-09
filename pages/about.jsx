import Container from "@/components/container";
import Header from "@/components/header";
import Layout from "@/components/layout";
import Head from "next/head";
import Image from "next/image";
import profilePic from "../public/assets/profile_bw.jpeg";
import backgroundImage from "../public/assets/mountains_bg_img.jpeg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { brands } from "@fortawesome/fontawesome-svg-core/import.macro";

export default function About() {
  return (
    <>
      <main className="profile-page">
        <Layout>
          <Container>
            <Head>
              <title>About</title>
            </Head>
            <Header />
            <section className="relative block">
              <Image
                src={backgroundImage}
                alt="teton lake"
                className="absolute top-0 w-full h-full rounded-md bg-top bg-cover"
              />
            </section>
            <section className="relative py-16">
              <div className="container mx-auto">
                <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl  -mt-20">
                  <div className="p-8">
                    <div className="flex flex-wrap justify-center">
                      <div className="w-full md:w-3/12 lg:order-2 flex justify-center">
                        <div className="relative">
                          <Image
                            src={profilePic}
                            alt="profile picture of author"
                            className="drop-shadow-md rounded-full h-auto align-middle border-none absolute -m-16 -ml-20 lg:-ml-16"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="font-body text-center mt-12">
                      <h3 className="text-4xl font-semibold leading-normal mb-2 text-gray-800 mb-2">
                        Clay Coffman
                      </h3>
                      <div className="text-sm leading-normal mt-0 mb-2 text-gray-500 font-bold uppercase">
                        <span className="mr-2">
                          <FontAwesomeIcon icon={brands("twitter")} />
                        </span>
                        Los Angeles, California
                      </div>
                      <div className="mb-2 text-gray-700 mt-10">
                        Product leader, founder, investor, builder
                      </div>
                    </div>
                    <div className="mt-10 text-center">
                      <div className="flex flex-wrap justify-center">
                        <div className="w-full lg:w-6/12 px-4">
                          <div className="py-10 border-t border-b border-gray-300">
                            <p className="font-body mb-4 text-lg text-gray-800">
                              blurb stuff goes here blurb stuff goes here blurb
                              stuff goes here blurb stuff goes here blurb stuff
                              goes here blurb stuff goes here blurb stuff goes
                              here blurb stuff goes here blurb stuff goes here
                              blurb stuff goes here blurb stuff goes here blurb
                              stuff goes here blurb stuff goes here blurb stuff
                              goes here
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-10 text-center">
                      <h3 className="font-body text-4xl font-semibold leading-normal py-10 text-gray-800 mb-2">
                        Get in touch
                      </h3>
                      <div className="flex flex-wrap justify-center">
                        <div className="w-full lg:w-6/12 px-4">
                          <div className="py-4">
                            <p className="font-body mb-4 text-lg text-gray-800">
                              you can reach me via email at claymcoffman @
                              gmail.com
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </Container>
        </Layout>
      </main>
    </>
  );
}
