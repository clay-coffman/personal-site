module.exports = {
  images: {
    domains: ["journals.ghost.io"],
    // use experimental remotePatterns to handle random subdomains from cdn
    // remotePatterns: [
    //   {
    //     hostname: [
    //       "**.media-amazon.com",
    //       "**.ghost.io",
    //       "**.ssl-images-amazon.com",
    //       "**.amazonaws.com",
    //       "unsplash.com",
    //       "**.unsplash.com",
    //       "googleusercontent.com",
    //       "**.googleusercontent.com",
    //       "openseauserdata.com",
    //       "**.openseauserdata.com",
    //       "**.img.seadn.io",
    //       "img.seadn.io",
    //       "arweave.net",
    //       "**.arweave.net",
    //       "**.ipfs.io",
    //       "**.solnft.host",
    //       "3334445556666.com",
    //       "**.ibb.co",
    //     ],
    //   },
    // ],
  },
  webpack(config) {
    config.resolve.fallback = {
      ...config.resolve.fallback, // if you miss it, all the other options in fallback, specified
      // by next.js will be dropped. Doesn't make much sense, but how it is
      fs: false, // the solution
    };

    return config;
  },
};
