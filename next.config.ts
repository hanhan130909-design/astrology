import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Image optimization
  images: {
    formats: ["image/webp", "image/avif"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    // Performance: Enable device sizes for faster image generation
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },
  
  // Compression (gzip/brotli via Vercel)
  compress: true,
  
  // Performance optimizations
  poweredByHeader: false,
  generateEtags: true,
  
  // Experimental features
  experimental: {
    optimizePackageImports: ["lucide-react"],
    reactCompiler: false,
  },
  output: "export",
};

export default nextConfig;
