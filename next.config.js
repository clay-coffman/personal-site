module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.aframe.io",
        port: "",
        pathname: "/a-painter/images/*",
      },
    ],
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
