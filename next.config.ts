// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.ascsport.it",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.seristampa.promo",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "centrosp.it",
        pathname: "/**",
      },
    ],
 
  },
};

module.exports = nextConfig;

