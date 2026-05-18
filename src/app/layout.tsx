import type { Metadata, Viewport } from "next";
import "./globals.css";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";

export const metadata: Metadata = {
  title: {
    default: "星缘 - 免费AI占星解读 | 专业在线排盘·本命盘·推运盘·合盘·塔罗·运势 | Starry Fate",
    template: "%s | 星缘",
  },
  description: "探索星座的命运奥秘，星缘提供基于真实天文计算与先进AI技术的免费在线占星服务。全面支持本命盘、推运盘、合盘比对、AI智能解读、塔罗占卜、每日/每月/每年运势解读。输入出生信息，即刻生成专业星盘报告，精准排盘，专业分析，助你读懂星盘密码，掌握命运轨迹，开启专属占星之旅。" "星座", "horoscope", "占星", "zodiak", "AI占星", "natal chart", "本命盘", "tarot", "塔罗", "运势", "星盘"],
  authors: [{ name: "星缘" }],
  creator: "星缘团队",
  publisher: "星缘",
  metadataBase: new URL("https://astrology-clean.vercel.app"),
  alternates: {
    canonical: "/",
    languages: {
      "zh-CN": "/",
      "en-US": "/en",
      "id-ID": "/id",
    },
  },
  openGraph: {
    title: "星缘 - 专业星座分析平台",
  description: "探索星座的命运奥秘，星缘提供基于真实天文计算与先进AI技术的免费在线占星服务。全面支持本命盘、推运盘、合盘比对、AI智能解读、塔罗占卜、每日/每月/每年运势解读。输入出生信息，即刻生成专业星盘报告。",
    type: "website",
    locale: "zh_CN",
    siteName: "星缘",
    images: [{
      url: "/og-image.png",
      width: 1200,
      height: 630,
      alt: "星缘 - 专业星座分析平台",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "星缘 - 专业星座分析平台",
  description: "探索星座的命运奥秘，星缘提供基于真实天文计算与先进AI技术的免费在线占星服务。全面支持本命盘、推运盘、合盘比对、AI智能解读、塔罗占卜、每日/每月/每年运势解读。输入出生信息，即刻生成专业星盘报告。",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180" },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#030014" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode,
}) {
  return (
    <html lang="zh" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="bg-[#030014] text-white antialiased min-h-screen dark">
        <ServiceWorkerRegister />
        <ThemeProvider>
          <LanguageProvider>
            <AuthProvider>
              {children}
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
