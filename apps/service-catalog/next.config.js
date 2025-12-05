//@ts-check

const { withNx } = require("@nx/next/plugins/with-nx");
const path = require("path");

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
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
  webpack(config) {
    // Disable webpack cache to eliminate serialization warnings
    config.cache = false;

    return config;
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = withNx(nextConfig);
