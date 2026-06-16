import type { NextConfig } from "next";

const isGithubPages = process.env.GITHUB_PAGES === "true";
const repoName = process.env.GITHUB_PAGES_REPO ?? "";
const githubPagesBasePath = repoName ? `/${repoName}` : "";

const nextConfig: NextConfig = {
  output: isGithubPages ? "export" : undefined,
  basePath: isGithubPages && githubPagesBasePath ? githubPagesBasePath : undefined,
  assetPrefix: isGithubPages && githubPagesBasePath ? `${githubPagesBasePath}/` : undefined,
  trailingSlash: isGithubPages,
  images: {
    unoptimized: isGithubPages,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "*.supabase.co" },
    ],
  },
};

export default nextConfig;
