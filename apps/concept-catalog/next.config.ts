import path from "path";
import type { WithNxOptions } from "@nx/next/plugins/with-nx.js";
import { withNx } from "@nx/next/plugins/with-nx.js";

const nextConfig: WithNxOptions = {
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

export default withNx(nextConfig);
