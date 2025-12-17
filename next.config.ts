import type { NextConfig } from "next";

const repoName = "ygophmeta";
const development = process.env.DEVELOPMENT === "true";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  assetPrefix: !development ? `/${repoName}/` : undefined,
  basePath: !development ? `/${repoName}` : undefined,
};

export default nextConfig;
