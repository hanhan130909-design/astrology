import type { NextConfig } from "next";
import { readFileSync } from "node:fs";
import { join } from "node:path";

// 78 条旧配对博客 URL → 66 个规范配对页（脚本生成，见 scripts/generate-compat-redirects.mjs）
function compatibilityRedirects() {
  try {
    const raw = readFileSync(
      join(process.cwd(), "src/content/compatibility-redirects.json"),
      "utf8",
    );
    const map = JSON.parse(raw) as Record<string, string>;
    return Object.entries(map).map(([source, destination]) => ({
      source,
      destination,
      permanent: true,
    }));
  } catch {
    return [];
  }
}

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

  // 配对内容收敛：旧薄页永久跳转到新规范页
  async redirects() {
    return compatibilityRedirects();
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
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net https://*.adtrafficquality.google https://*.googleapis.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://www.google-analytics.com https://www.google.com https://www.google.co.id https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net https://*.adtrafficquality.google https://*.googleapis.com; connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://stats.g.doubleclick.net https://ad.doubleclick.net https://www.google.com https://*.adtrafficquality.google https://*.googleapis.com https://*.vercel.live; font-src 'self' data:; frame-src 'self' https://*.google.com https://googleads.g.doubleclick.net https://*.adtrafficquality.google;",
          },
          { key: "Cache-Control", value: "public, max-age=0, must-revalidate" },
        ],
      },
      {
        source: "/_next/static/(.*?)",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        source: "/icon-(.*?).png",
        headers: [{ key: "Cache-Control", value: "public, max-age=604800" }],
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
