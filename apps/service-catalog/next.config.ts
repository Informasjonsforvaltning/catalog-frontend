import { join } from "node:path";
import { withNx } from "@nx/next/plugins/with-nx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    SERVICE_CATALOG_BASE_URI: process.env.SERVICE_CATALOG_BASE_URI,
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
};

export default withNx(nextConfig);
