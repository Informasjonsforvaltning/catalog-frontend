//@ts-check

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    DATASET_CATALOG_BASE_URI: process.env.DATASET_CATALOG_BASE_URI,
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
