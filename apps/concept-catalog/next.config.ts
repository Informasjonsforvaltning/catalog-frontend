import { join } from "node:path";
import { withNx } from "@nx/next/plugins/with-nx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  turbopack: {
    root: join(__dirname, "../.."),
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
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

export default withNx(nextConfig);
