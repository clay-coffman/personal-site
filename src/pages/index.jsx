import Container from "@/components/container";
import Head from "next/head";
import Header from "@/components/header";
import Image from "next/image";
import Layout from "@/components/layout";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLinkedin, faTwitter, faGithub } from "@fortawesome/free-brands-svg-icons";
import { faMapPin } from "@fortawesome/free-solid-svg-icons";

import profilePic from "@/public/assets/profile_bw.jpeg";

import { experiences, sideProjects, education } from "@/data/profile";

export default function Index() {
  const socialLinks = [
    {
      platform: "LinkedIn",
      url: "https://www.linkedin.com/in/claymcoffman/",
      icon: faLinkedin,
    },
    {
      platform: "Twitter",
      url: "https://twitter.com/Clay_Coffman",
      icon: faTwitter,
    },
    {
      platform: "GitHub",
      url: "https://github.com/claycoffman",
      icon: faGithub,
    },
  ];

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
                                {experiences.map((exp, index) => (
                                  <li
                                    key={index}
                                    className="mt-4 text-md lg:text-xl"
                                  >
                                    <span className="font-bold">
                                      {exp.url ? (
                                        <a
                                          href={exp.url}
                                          rel="noreferrer"
                                          target="_blank"
                                        >
                                          {exp.company}
                                        </a>
                                      ) : (
                                        exp.company
                                      )}
                                    </span>
                                    <span className="text-sm lg:text-xl text-gray-500 italic">
                                      {" "}
                                      {exp.role}{" "}
                                      {exp.period && `(${exp.period})`}
                                    </span>
                                    <p className="mt-2 text-sm lg:text-lg">
                                      {exp.description}
                                    </p>
                                  </li>
                                ))}
                              </ul>
                              <p className="mt-8 font-body text-xl text-center lg:text-2xl font-semibold text-gray-800">
                                Stuff I Do Sometimes
                              </p>
                              <div className="text-left mb-8">
                                <ul className="list-outside font-body">
                                  {sideProjects.map((project, index) => (
                                    <li
                                      key={index}
                                      className="mt-4 text-md lg:text-xl"
                                    >
                                      {project.title}{" "}
                                      <p className="mt-2 text-sm lg:text-lg">
                                        {project.description}
                                      </p>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              <p className="font-body text-xl lg:text-2xl font-semibold text-gray-800">
                                Education, Certifications, and Other Stuff
                              </p>
                              <div className="text-left mb-8">
                                <ul className="list-outside font-body">
                                  {education.map((edu, index) => (
                                    <li
                                      key={index}
                                      className="mt-4 text-md lg:text-xl"
                                    >
                                      {edu.institution}{" "}
                                      <span className="text-sm lg:text-xl text-gray-500 italic">
                                        {edu.credential}{" "}
                                        {edu.year && `(${edu.year})`}
                                      </span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
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
                              {socialLinks.map((social, index) => (
                                <span key={index} className="mx-2">
                                  <a
                                    href={social.url}
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    <FontAwesomeIcon icon={social.icon} />
                                  </a>
                                </span>
                              ))}
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
