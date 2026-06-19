import type { Metadata, Viewport } from "next";
import "./globals.css";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: {
    default: "星缘 - 免费AI占星解读 | 专业在线排盘·本命盘·推运盘·合盘·塔罗·运势 | Starry Fate",
    template: "%s | 星缘",
  },
  description: "探索星座的命运奥秘，星缘提供基于真实天文计算与先进AI技术的免费在线占星服务。全面支持本命盘、推运盘、合盘比对、AI智能解读、塔罗占卜、每日/每月/每年运势解读。输入出生信息，即刻生成专业星盘报告，精准排盘，专业分析，助你读懂星盘密码，掌握命运轨迹，开启专属占星之旅。免费体验，无需注册，让星辰指引你的人生方向。",
  keywords: ["星座", "horoscope", "占星", "zodiak", "AI占星", "natal chart", "本命盘", "tarot", "塔罗", "运势", "星盘"],
  authors: [{ name: "星缘" }],
  creator: "星缘团队",
  publisher: "星缘",
  metadataBase: new URL("https://lunaxstar.com"),
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
    description: "探索星座的命运奥秘，星缘提供基于真实天文计算与先进AI技术的免费在线占星服务。全面支持本命盘、推运盘、合盘比对、AI智能解读、塔罗占卜、每日/每月/每年运势解读。输入出生信息，即刻生成专业星盘报告，精准排盘，专业分析，助你读懂星盘密码，掌握命运轨迹，开启专属占星之旅。免费体验，无需注册，让星辰指引你的人生方向。",
    type: "website",
    url: "https://lunaxstar.com",
    locale: "zh_CN",
    siteName: "星缘",
    images: [{
      url: "/opengraph-image.png",
      width: 1200,
      height: 630,
      alt: "星缘 - 专业星座分析平台",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "星缘 - 专业星座分析平台",
    description: "探索星座的命运奥秘，星缘提供基于真实天文计算与先进AI技术的免费在线占星服务。全面支持本命盘、推运盘、合盘比对、AI智能解读、塔罗占卜、每日/每月/每年运势解读。输入出生信息，即刻生成专业星盘报告，精准排盘，专业分析，助你读懂星盘密码，掌握命运轨迹，开启专属占星之旅。免费体验，无需注册，让星辰指引你的人生方向。",
    images: ["/opengraph-image.png"],
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
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180" },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode,
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "星缘",
    "alternateName": ["Starry Fate", "Love Astrology", "Cinta Bintang"],
    "url": "https://lunaxstar.com",
    "description": "探索星座的命运奥秘，星缘提供基于真实天文计算与先进AI技术的免费在线占星服务。全面支持本命盘、推运盘、合盘比对、AI智能解读、塔罗占卜、运势解读。",
    "keywords": "星座,占星,本命盘,推运盘,合盘,塔罗,运势,星盘,在线排盘,AI占星",
    "author": { "@type": "Organization", "name": "星缘团队" },
    "publisher": { "@type": "Organization", "name": "星缘", "url": "https://lunaxstar.com" },
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://lunaxstar.com/natal?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <html lang="zh" suppressHydrationWarning>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="星缘" />
        <meta name="theme-color" content="#171717" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        {/* Non-blocking CSS loader — prevents render-blocking chain */}
        <script dangerouslySetInnerHTML={{__html:`(function(){var l=document.querySelectorAll('link[rel="stylesheet"]');for(var i=0;i<l.length;i++){var s=l[i];s.media='print';s.onload=function(){this.media='all';this.onload=null}}})()`}} />
        {/* System fonts — no Google Fonts CDN (blocked in China) */}
        <style>{`
          @font-face { font-family: 'Inter'; font-style: normal; font-weight: 400; src: local('Inter'), local('PingFang SC'), local('Microsoft YaHei'); }
          @font-face { font-family: 'Noto Sans SC'; font-style: normal; font-weight: 400; src: local('Noto Sans SC'), local('PingFang SC'), local('Microsoft YaHei'), local('SimHei'); }
          body { font-family: 'PingFang SC', 'Microsoft YaHei', 'Helvetica Neue', system-ui, -apple-system, sans-serif; }
        `}</style>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-CSE41GD9JL" />
        <script dangerouslySetInnerHTML={{__html:`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','G-CSE41GD9JL');`}} />
      </head>
      <body className="bg-white text-gray-900 antialiased min-h-screen overflow-x-hidden">
        <ServiceWorkerRegister />
        <ThemeProvider>
          <LanguageProvider>
            <AuthProvider>
              <Navbar />
              {children}
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

