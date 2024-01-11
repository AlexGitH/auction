/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  webpack: config => {
    config.watchOptions.poll = 500;
    return config;
  }
}

module.exports = nextConfig
