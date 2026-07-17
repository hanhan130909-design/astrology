import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: process.env.NEXT_DIST_DIR || ".next",
  serverExternalPackages: ["sweph", "node-gyp-build"],
  
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
  poweredByHeader: false,
  generateEtags: true,
  eslint: { ignoreDuringBuilds: true },
  typescript: {
    ignoreBuildErrors: true,
    tsconfigPath: process.env.NEXT_TSCONFIG_PATH || "tsconfig.json",
  },
  
  // Experimental features
  experimental: {
    optimizePackageImports: ["lucide-react"],
    reactCompiler: false,
  },

  // Security headers + CORS + caching
  async headers() {
    return [
      {
        source: "/(.*?)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(self), interest-cohort=()" },
          {
            key: "Content-Security-Policy",
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net https://*.googleapis.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://www.google-analytics.com https://www.google.com https://www.google.co.id https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net https://*.googleapis.com; connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://stats.g.doubleclick.net https://ad.doubleclick.net https://www.google.com https://*.adtrafficquality.google https://*.googleapis.com https://*.vercel.live; font-src 'self' data:; frame-src 'self' https://*.google.com https://googleads.g.doubleclick.net;",
          },
          { key: "Cache-Control", value: "public, max-age=0, must-revalidate" },
        ],
      },
      {
        source: "/api/(.*?)",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "https://lunaxstar.com" },
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Methods", value: "GET, POST, PUT, DELETE, OPTIONS" },
        ],
      },
    ];
  },
};

export default nextConfig;
