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
    // Performance: Enable React Compiler optimization
    reactCompiler: false,
  },
  
  // Headers for security, caching and performance
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // Security headers
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Performance: DNS prefetch + Preconnect hints
          { key: "Link", value: "</fonts.googleapis.com>; rel=preconnect; crossorigin" },
          { key: "Link", value: "</fonts.gstatic.com>; rel=preconnect; crossorigin" },
        ],
      },
      // Cache static assets aggressively
      {
        source: "/sw.js",
        headers: [{ key: "Cache-Control", value: "public, max-age=0, must-revalidate" }],
      },
      {
        source: "/manifest.json",
        headers: [{ key: "Cache-Control", value: "public, max-age=3600" }],
      },
      {
        source: "/icon-(.*)",
        headers: [{ key: "Cache-Control", value: "public, max-age=86400, immutable" }],
      },
      // Cache OG images
      {
        source: "/opengraph-image.png",
        headers: [{ key: "Cache-Control", value: "public, max-age=3600" }],
      },
      // Long cache for hashed assets (Next.js auto-hashes)
      {
        source: "/_next/static/(.*)",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

export default nextConfig;
