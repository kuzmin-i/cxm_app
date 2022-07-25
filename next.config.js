/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  /* */
  webpack5: true,
  webpack: (config) => {
    config.resolve.fallback = { fs: false };

    return config;
  },
  resolve: {
    fallback: {
      process: false
    }
  },
  serverRuntimeConfig: {
    PROJECT_ROOT: __dirname
  }
};

module.exports = nextConfig;
