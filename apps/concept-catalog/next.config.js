//@ts-check

const { withNx } = require("@nx/next/plugins/with-nx");

/** @type {import('next').NextConfig} */
const nextConfig = {
  nx: {
    svgr: false,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
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
