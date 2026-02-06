const isGithubActions = Boolean(process.env.GITHUB_ACTIONS);

let assetPrefix = "";
let basePath = "";

if (isGithubActions && process.env.GITHUB_REPOSITORY) {
  const repo = process.env.GITHUB_REPOSITORY.split("/")[1];
  assetPrefix = `/${repo}/`;
  basePath = `/${repo}`;
}

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  assetPrefix,
  basePath,
};

module.exports = nextConfig;
