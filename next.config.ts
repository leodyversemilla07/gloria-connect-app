import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh6.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'acmecorp.com',
      },
      {
        protocol: 'https',
        hostname: 'globex.com',
      },
      {
        protocol: 'https',
        hostname: 'soylent.com',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
    ],
  },
  // Convex auth requires server external packages
  serverExternalPackages: ['@convex-dev/auth'],
};

export default nextConfig;
