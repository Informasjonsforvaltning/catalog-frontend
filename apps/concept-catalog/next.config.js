//@ts-check

const { withNx } = require("@nx/next/plugins/with-nx");

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
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
  webpack(config) {
    // Disable webpack cache to eliminate serialization warnings
    config.cache = false;

    return config;
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
