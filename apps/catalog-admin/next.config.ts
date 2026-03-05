import path from "path";
import type { WithNxOptions } from "@nx/next/plugins/with-nx.js";
import { withNx } from "@nx/next/plugins/with-nx.js";

const nextConfig: WithNxOptions = {
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
};

export default withNx(nextConfig);
