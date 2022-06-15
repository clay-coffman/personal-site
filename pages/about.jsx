import Container from "@/components/container";
import Header from "@/components/header";
import Layout from "@/components/layout";
import Head from "next/head";
import Image from "next/image";
import profilePic from "../public/assets/profile_bw.jpeg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { brands } from "@fortawesome/fontawesome-svg-core/import.macro";
import { faMapPin } from "@fortawesome/free-solid-svg-icons";

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
            <section className="relative py-16">
              <div className="container">
                <div className="relative flex flex-col min-w-0 rounded break-words bg-white mb-6 shadow-xl -mt-20">
                  <div className="p-12 lg:p-24">
                    <div className="flex flex-wrap justify-center">
                      <div className="w-full md:w-3/12 lg:order-2 flex justify-center">
                        <div className="relative drop-shadow-md">
                          <Image
                            src={profilePic}
                            alt="profile picture of author"
                            className="rounded-full h-auto align-middle border-none absolute -m-16 -ml-20 lg:-ml-16"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="font-body text-center mt-12">
                      <h3 className="text-2xl lg:text-4xl font-semibold leading-normal mb-2 text-gray-800 mb-2">
                        Clay Coffman
                      </h3>
                      <div className="text-xs lg:text-sm leading-normal mt-0 mb-2 text-gray-500 font-bold uppercase">
                        <span className="mr-2">
                          <FontAwesomeIcon icon={faMapPin} />
                        </span>
                        Los Angeles, California
                      </div>
                      <div className="mb-2 text-gray-700 mt-8">
                        Product leader, founder, investor, builder
                      </div>
                    </div>
                    <div className="mt-8 text-center">
                      <div className="flex flex-wrap justify-center">
                        <div className="w-full lg:w-6/12 px-4">
                          <div className="py-8 border-t border-b border-gray-300">
                            <p className="font-body text-sm lg:text-lg text-gray-800">
                              Midwestern boy who finally found his way out to
                              the west coast. Since I was a kid I liked to build
                              things - whether it was jumps for a dirtbike or
                              modding my family's computer - I was always
                              hacking away at something. I should have been an
                              engineer but I ended up not being a great fit for
                              the rigors of a traditional computer science
                              degree.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-center m-8">
                      <h3 className="font-body text-2xl lg:text-4xl font-semibold leading-normal text-gray-800 mb-4">
                        Get in touch
                      </h3>
                      <div className="flex flex-wrap justify-center">
                        <div className="w-full lg:w-6/12 px-4">
                          <div className="py-4">
                            <p className="font-body mb-4 text-md lg:text-lg text-gray-800">
                              You can find me on
                              <span className="mx-2">
                                <a
                                  href="https://www.linkedin.com/in/claymcoffman/"
                                  target="_blank"
                                >
                                  <FontAwesomeIcon icon={brands("LinkedIn")} />
                                </a>
                              </span>
                              or
                              <span className="mx-2">
                                <a
                                  href="https://twitter.com/Clay_Coffman"
                                  target="_blank"
                                >
                                  <FontAwesomeIcon icon={brands("twitter")} />
                                </a>
                              </span>
                              or shoot me an email - claymcoffman @ gmail.com
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
