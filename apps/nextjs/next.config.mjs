import "./src/env.mjs";
import withMDX from "@next/mdx";

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  /** Enables hot reloading for local packages without a build step */
  transpilePackages: ["@monitall/db"],
  pageExtensions: ["ts", "tsx", "mdx"],
  experimental: {
    appDir: true,
    mdxRs: true,
    typedRoutes: true,
    serverActions: true,
    serverComponentsExternalPackages: ["@prisma/client"],
  },
  /** We already do linting and typechecking as separate tasks in CI */
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
};

export default withMDX()(config);
