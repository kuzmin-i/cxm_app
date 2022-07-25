/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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
