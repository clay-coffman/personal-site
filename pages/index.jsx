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
                              modding my familys computer - I was always hacking
                              away at something. I should have been an engineer
                              but I ended up not being a great fit for the
                              rigors of a traditional computer science degree.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-8 text-center">
                      <div className="flex flex-wrap justify-center">
                        <div className="w-full lg:w-6/12 px-4">
                          <div className="pb-8 border-b border-gray-300">
                            <p className="font-body text-sm lg:text-lg text-gray-800">
                              Experience
                            </p>
                            <div className="text-left mb-8">
                              <ul className="list-outside font-body">
                                <li className="mt-4 text-md lg:text-xl">
                                  Cryptoslam{" "}
                                  <span className="text-sm lg:text-xl text-gray-500 italic">
                                    Chief Product Officer
                                  </span>
                                  <br></br>
                                  <p className="mt-2 text-sm lg:text-lg indent-8">
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
                                  <p className="mt-2 text-sm lg:text-lg indent-8">
                                    Rolled over as a Director of Product
                                    Management after Zego was acquired by
                                    PayLease. Was in charge of running the
                                    Resident Experience products
                                    post-acquisition.{" "}
                                    <span className="italic">
                                      PayLease was rebranded as Zego after our
                                      acquistion... hence "Zego (Powered by
                                      PayLease)"
                                    </span>
                                  </p>
                                </li>
                                <li className="mt-4 text-md lg:text-xl">
                                  Zego{" "}
                                  <span className="text-sm lg:text-xl text-gray-500 italic">
                                    Co-founder/Head of Product
                                  </span>
                                  <br></br>
                                  <p className="mt-2 text-sm lg:text-lg indent-8">
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
                                  <p className="mt-2 text-sm lg:text-lg indent-8">
                                    Commercial solar installer. Initially worked
                                    in sales, transitioned into product role to
                                    help launch Brighterlink building management
                                    product. Also helped build out marketing and
                                    sales process automation (Salesforce,
                                    Marketo, etc).
                                  </p>
                                </li>
                                <li className="mt-4 text-md lg:text-xl">
                                  Sungevity{" "}
                                  <span className="text-sm lg:text-xl text-gray-500 italic">
                                    Solar Consultant
                                  </span>
                                  <br></br>
                                  <p className="mt-2 text-sm lg:text-lg indent-8">
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
                                  <p className="mt-2 text-sm lg:text-lg indent-8">
                                    I sold software to martial arts and yoga
                                    studios.
                                  </p>
                                </li>
                              </ul>
                            </div>
                            <p className="font-body text-sm lg:text-lg text-gray-800">
                              Education, Certifications, and Other Stuff
                            </p>
                            <div className="text-left mb-8">
                              <ul className="list-outside font-body">
                                <li className="mt-4 text-md lg:text-xl">
                                  University of British Columbia{" "}
                                  <span className="text-sm lg:text-xl text-gray-500 italic">
                                    B.A. Psychology
                                  </span>
                                  <br></br>
                                  <p className="mt-2 text-sm lg:text-lg indent-8">
                                    Went to school for a double major in Comp
                                    Sci and Business, graduated with a Psych
                                    degree... wasn't a great "student".
                                  </p>
                                </li>
                                <li className="mt-4 text-md lg:text-xl">
                                  Udacity{" "}
                                  <span className="text-sm lg:text-xl text-gray-500 italic">
                                    Full Stack Web Developer Nanodegree
                                  </span>
                                  <br></br>
                                  <p className="mt-2 text-sm lg:text-lg indent-8">
                                    Fun refresher I did to brush up on coding
                                    skills. Mostly Python (Flask), Javascript
                                    (React/Angular), and various infra/devops
                                    tools (k8s, AWS, Heroku, Docker, etc).
                                  </p>
                                </li>
                                <li className="mt-4 text-md lg:text-xl">
                                  Corporate Finance Institute{" "}
                                  <span className="text-sm lg:text-xl text-gray-500 italic">
                                    Financial Modeling and Valuation Analyst
                                    Cerfificate
                                  </span>
                                  <br></br>
                                  <p className="mt-2 text-sm lg:text-lg indent-8">
                                    Wanted to improve my financial modeling
                                    skills. Turns out, I really like it.
                                  </p>
                                </li>
                                <li className="mt-4 text-md lg:text-xl">
                                  Pragmatic Marketing Institute{" "}
                                  <span className="text-sm lg:text-xl text-gray-500 italic">
                                    PMC Level IV
                                  </span>
                                  <br></br>
                                  <p className="mt-2 text-sm lg:text-lg indent-8">
                                    Product Management development. Really great
                                    program, part of Vista's PM development
                                    curriculum.
                                  </p>
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
                            <p className="font-body mb-4 text-md lg:text-lg text-gray-800">
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
