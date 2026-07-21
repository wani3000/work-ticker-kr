import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  output: isGitHubPages ? "export" : undefined,
  basePath: isGitHubPages ? "/work-ticker-kr" : undefined,
  assetPrefix: isGitHubPages ? "/work-ticker-kr/" : undefined,
  trailingSlash: isGitHubPages,
  images: { unoptimized: true },
  typescript: { ignoreBuildErrors: isGitHubPages },
};

export default nextConfig;
