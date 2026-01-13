//@ts-check

const { withNx } = require("@nx/next/plugins/with-nx");

/** @type {import('next').NextConfig} */
const nextConfig = {
  nx: {
    svgr: false,
  },
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

module.exports = withNx(nextConfig);
