import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  assetPrefix: undefined, // Remove or set to undefined
  basePath: undefined, // Remove or set to undefined
};

export default nextConfig;

// import type { NextConfig } from "next";

// const repoName = "ygophmeta";
// const isProd = process.env.NODE_ENV === "production";

// const nextConfig: NextConfig = {
//   output: "export",
//   images: {
//     unoptimized: true,
//   },
//   assetPrefix: isProd ? `/${repoName}/` : undefined,
//   basePath: isProd ? `/${repoName}` : undefined,
// };

// export default nextConfig;
