import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "星象日历 - 行星换座、月相、逆行与相位",
  description: "按月份查看太阳换座、月相、行星换座、逆行顺行与重要相位，不需要填写出生资料。",
  keywords: ["星象日历", "astrology calendar", "moon phases", "planetary ingress", "retrograde"],
  openGraph: {
    title: "星象日历 - 行星换座、月相、逆行与相位",
    description: "Monthly astrology calendar for planetary ingresses, moon phases, retrogrades, direct stations, and major aspects.",
    type: "website",
    siteName: "Starry Fate",
  },
  twitter: {
    card: "summary_large_image",
    title: "星象日历 - 行星换座、月相、逆行与相位",
    description: "Monthly astrology calendar for planetary ingresses, moon phases, retrogrades, direct stations, and major aspects.",
  },
};

export default function TransitsLayout({
  children,
}: {
  children: React.ReactNode,
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Astrology Calendar",
            description: "Monthly astrology calendar for planetary ingresses, moon phases, retrogrades, direct stations, and major aspects.",
            provider: { "@type": "Organization", name: "星缘", url: "https://lunaxstar.com" }
          })
        }}
      />
      {children}
    </>
  );
}
