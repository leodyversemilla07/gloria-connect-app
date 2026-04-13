import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  cacheComponents: false,
  turbopack: {
    root: process.cwd(),
  },
  allowedDevOrigins: ["20.25.29.240"],
};

export default nextConfig;
