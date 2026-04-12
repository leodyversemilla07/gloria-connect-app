import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  cacheComponents: false,
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
