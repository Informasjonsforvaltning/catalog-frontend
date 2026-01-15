//@ts-check
const path = require("path");
const { withNx } = require("@nx/next/plugins/with-nx");

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  turbopack: {
    root: path.join(__dirname, "../.."),
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
  async redirects() {
    return [
      {
        source: "/:catalogId(\\d{1,})/:conceptId*",
        destination: "/catalogs/:catalogId/concepts/:conceptId*",
        permanent: true,
      },
      {
        source: "/:catalogId(\\d{1,})",
        destination: "/catalogs/:catalogId/concepts",
        permanent: true,
      },
    ];
  },
};

module.exports = withNx(nextConfig);
