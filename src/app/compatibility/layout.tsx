import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "免费星座合盘比对 | 双人关系分析 | 星缘占星",
  description: "免费星座合盘在线比对，分析两人星盘互动关系。爱情配对、友情兼容性、合作关系全方位解读，帮你了解彼此星座匹配度。",
  keywords: ["合盘", "synastry", "星座配对", "双人星盘", "关系分析", "爱情匹配", "星座合盘", "免费合盘"],
  openGraph: {
    title: "免费星座合盘比对 | 双人关系分析",
    description: "免费星座合盘在线比对，分析两人星盘互动关系。爱情配对、友情兼容性、合作关系全方位解读。",
    type: "website",
    url: "https://astrology-clean.vercel.app/compatibility",
    siteName: "星缘",
    images: [{
      url: "/og-image.png",
      width: 1200,
      height: 630,
      alt: "星座合盘比对 - 星缘",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "免费星座合盘比对 | 双人关系分析",
    description: "免费星座合盘在线比对，分析两人星盘互动关系。爱情配对、友情兼容性全方位解读。",
    images: ["/og-image.png"],
  },
};

export default function CompatibilityLayout({
  children,
}: {
  children: React.ReactNode,
}) {
  return children;
}
