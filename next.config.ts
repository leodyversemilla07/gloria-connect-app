import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  cacheComponents: true,
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
