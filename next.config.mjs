/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Content is mostly static/server-rendered; only the calculator hydrates.
  experimental: {
    optimizePackageImports: [],
  },
};

export default nextConfig;
