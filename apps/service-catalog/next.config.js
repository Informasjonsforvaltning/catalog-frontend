//@ts-check

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    SERVICE_CATALOG_BASE_URI: process.env.SERVICE_CATALOG_BASE_URI,
  },
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
