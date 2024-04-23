import Container from "@/components/container";
import Head from "next/head";
import Header from "@/components/header";
import Image from "next/image";
import Layout from "@/components/layout";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { brands } from "@fortawesome/fontawesome-svg-core/import.macro";
import { faMapPin } from "@fortawesome/free-solid-svg-icons";

import profilePic from "../public/assets/profile_bw.jpeg";

export default function Index() {
  return (
    <>
      <main className="profile-page">
        <Layout>
          <Container>
            <Head>
              <title>About</title>
            </Head>
            <Header />
            <section className="relative">
              <div className="container">
                <div className="relative flex flex-col min-w-0 rounded break-words bg-white mb-6 shadow-xl">
                  <div className="p-12 lg:py-24">
                    <div className="flex flex-wrap justify-center">
                      <div className="w-full md:w-3/12 lg:order-2 flex justify-center">
                        <div className="relative drop-shadow-md">
                          <Image
                            src={profilePic}
                            alt="clay coffman profile pic"
                            className="rounded-full h-auto align-middle border-none"
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
                    </div>
                    <div className="mt-8 text-center">
                      <div className="flex flex-wrap justify-center">
                        <div className="w-full lg:w-6/12 px-4">
                          <div className="py-8 border-t border-b border-gray-300">
                            <p className="font-body text-sm lg:text-lg text-gray-800">
                              I&apos;ve heard that the hardest thing in the
                              world is change. The second hardest is writing a
                              blurb about yourself.<br></br>
                              <br></br>I&apos;ve worn a lot of different hats in
                              my career. I scratched and clawed my way into tech
                              via sales but ultimately I&apos;ve always loved
                              building products, so I feel like I ended up in
                              the right place in product management. Whether
                              it&apos;s software, legos, or motorcycles,
                              I&apos;ve always been tinkering or building
                              something.<br></br>
                              <br></br>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-8 text-center">
                      <div className="flex flex-wrap justify-center">
                        <div className="w-full lg:w-6/12 px-4">
                          <div className="pb-8 border-b border-gray-300">
                            <p className="font-body text-xl lg:text-2xl font-semibold text-gray-800">
                              Experience
                            </p>
                            <div className="text-left mb-8">
                              <ul className="list-outside font-body">
                                <li className="mt-4 text-md lg:text-xl">
                                  <span className="font-bold text-tradefoundry">
                                    <a
                                      href="https://www.tradefoundry.us"
                                      rel="noreferrer"
                                      target="_blank"
                                    >
                                      TradeFoundry
                                    </a>{" "}
                                  </span>
                                  <span className="text-sm lg:text-xl text-gray-500 italic">
                                    Co-founder/CEO (October 2022 - Present)
                                  </span>
                                  <br></br>
                                  <p className="mt-2 text-sm lg:text-lg">
                                    TradeFoundry is on a mission to solve the
                                    skilled labor crisis in America.
                                  </p>
                                </li>
                                <li className="mt-4 text-md lg:text-xl">
                                  On Deck{" "}
                                  <span className="text-sm lg:text-xl text-gray-500 italic">
                                    Fellow, ODF 20
                                  </span>
                                  <br></br>
                                  <p className="mt-2 text-sm lg:text-lg">
                                    Trying to find the next thing...
                                  </p>
                                </li>
                                <li className="mt-4 text-md lg:text-xl">
                                  Cryptoslam{" "}
                                  <span className="text-sm lg:text-xl text-gray-500 italic">
                                    Chief Product Officer
                                  </span>
                                  <br></br>
                                  <p className="mt-2 text-sm lg:text-lg">
                                    Multi-chain NFT market data aggregator.
                                    Joined in December 2021 as part of 10m
                                    venture round. Scaled product team from
                                    scratch.
                                  </p>
                                </li>
                                <li className="mt-4 text-md lg:text-xl">
                                  Zego (Powered By PayLease){" "}
                                  <span className="text-sm lg:text-xl text-gray-500 italic">
                                    Director of Product Management
                                  </span>
                                  <br></br>
                                  <p className="mt-2 text-sm lg:text-lg">
                                    Rolled over as a Director of Product
                                    Management after Zego was acquired by
                                    PayLease. Was in charge of running the
                                    Resident Experience products
                                    post-acquisition.{" "}
                                    <span className="italic">
                                      PayLease was rebranded as Zego after our
                                      acquistion... hence &quot;Zego (Powered by
                                      PayLease)&quot;.
                                    </span>
                                  </p>
                                </li>
                                <li className="mt-4 text-md lg:text-xl">
                                  Zego{" "}
                                  <span className="text-sm lg:text-xl text-gray-500 italic">
                                    Co-founder/Head of Product
                                  </span>
                                  <br></br>
                                  <p className="mt-2 text-sm lg:text-lg">
                                    Proptech startup that I co-founded and
                                    helped scale. We built an IoT device
                                    management platform for multifamily
                                    owners/operators, as well as a resident
                                    engagement app. Participated in Techstars
                                    Kansas City (2017).{" "}
                                    <a
                                      href="https://www.prweb.com/releases/paylease_acquires_zego_to_innovate_the_resident_living_experience/prweb16291564.htm"
                                      target="_blank"
                                      rel="noreferrer"
                                    >
                                      Acquired by Paylease, a Vista Equity
                                      Partners co. in 2019.
                                    </a>
                                  </p>
                                </li>
                                <li className="mt-4 text-md lg:text-xl">
                                  Brightergy{" "}
                                  <span className="text-sm lg:text-xl text-gray-500 italic">
                                    Sales/Process/Product Manager
                                  </span>
                                  <br></br>
                                  <p className="mt-2 text-sm lg:text-lg">
                                    Commercial solar installer. Initially worked
                                    in sales, transitioned into product role to
                                    help launch Brighterlink building management
                                    product.
                                  </p>
                                </li>
                                <li className="mt-4 text-md lg:text-xl">
                                  Sungevity{" "}
                                  <span className="text-sm lg:text-xl text-gray-500 italic">
                                    Solar Consultant
                                  </span>
                                  <br></br>
                                  <p className="mt-2 text-sm lg:text-lg">
                                    I sold solar panels to consumers all over
                                    the country. If you owned a roof in Southern
                                    California in 2016 I probably called you.
                                  </p>
                                </li>
                                <li className="mt-4 text-md lg:text-xl">
                                  PerfectMind Software{" "}
                                  <span className="text-sm lg:text-xl text-gray-500 italic">
                                    Business Development
                                  </span>
                                  <br></br>
                                  <p className="mt-2 text-sm lg:text-lg">
                                    I cold-called martial arts and yoga studios
                                    to sell them an out-dated CRM software. It
                                    was tough.
                                  </p>
                                </li>
                              </ul>
                              <p className="mt-8 font-body text-xl text-center lg:text-2xl font-semibold text-gray-800">
                                Stuff I Do Sometimes
                              </p>
                              <div className="text-left mb-8">
                                <ul className="list-outside font-body">
                                  <li className="mt-4 text-md lg:text-xl">
                                    Due Diligence Consulting{" "}
                                    <p className="mt-2 text-sm lg:text-lg">
                                      I have helped venture funds and other
                                      investors evalute potential investments.
                                    </p>
                                  </li>
                                  <li className="mt-4 text-md lg:text-xl">
                                    Angel Investing{" "}
                                    <p className="mt-2 text-sm lg:text-lg">
                                      DocuCare, Harmony.ai, ReNFT, Cabin Labs
                                    </p>
                                  </li>
                                </ul>
                              </div>
                            </div>
                            <p className="font-body text-xl lg:text-2xl font-semibold text-gray-800">
                              Education, Certifications, and Other Stuff
                            </p>
                            <div className="text-left mb-8">
                              <ul className="list-outside font-body">
                                <li className="mt-4 text-md lg:text-xl">
                                  University of British Columbia{" "}
                                  <span className="text-sm lg:text-xl text-gray-500 italic">
                                    B.A. Psychology (2015)
                                  </span>
                                </li>
                                <li className="mt-4 text-md lg:text-xl">
                                  Udacity{" "}
                                  <span className="text-sm lg:text-xl text-gray-500 italic">
                                    Full Stack Web Developer Nanodegree
                                  </span>
                                </li>
                                <li className="mt-4 text-md lg:text-xl">
                                  Corporate Finance Institute{" "}
                                  <span className="text-sm lg:text-xl text-gray-500 italic">
                                    Financial Modeling and Valuation Analyst
                                    (FMVA) Cerfificate
                                  </span>
                                </li>
                                <li className="mt-4 text-md lg:text-xl">
                                  Pragmatic Marketing Institute{" "}
                                  <span className="text-sm lg:text-xl text-gray-500 italic">
                                    PMC Level IV
                                  </span>
                                </li>
                                <li className="mt-4 text-md lg:text-xl">
                                  Dribbble Education{" "}
                                  <span className="text-sm lg:text-xl text-gray-500 italic">
                                    UI Design 101
                                  </span>
                                </li>
                              </ul>
                            </div>
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
                            <p className="font-body mb-4 text-sm md:text-lg text-gray-800">
                              You can find me on
                              <span className="mx-2">
                                <a
                                  href="https://www.linkedin.com/in/claymcoffman/"
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  <FontAwesomeIcon icon={brands("LinkedIn")} />
                                </a>
                              </span>
                              or
                              <span className="mx-2">
                                <a
                                  href="https://twitter.com/Clay_Coffman"
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  <FontAwesomeIcon icon={brands("twitter")} />
                                </a>
                              </span>
                              or
                              <span className="mx-2">
                                <a
                                  href="https://twitter.com/Clay_Coffman"
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  <FontAwesomeIcon icon={brands("github")} />
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
