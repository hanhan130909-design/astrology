import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["sweph", "node-gyp-build"],
  
  images: {
    formats: ["image/webp", "image/avif"],
    remotePatterns: [{ protocol: "https", hostname: "**" }],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },
  
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
  
  experimental: {
    optimizePackageImports: ["lucide-react"],
    optimizeCss: true,
    reactCompiler: false,
  },
};

export default nextConfig;
