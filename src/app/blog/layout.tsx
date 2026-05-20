import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Astrology Blog - Free Astrology Knowledge | 星缘',
  description: 'Learn astrology for free: birth chart tutorials, transit predictions, zodiac personality analysis, and 2026 horoscope forecasts. Discover the mysteries of astrology with AI-powered insights.',
  keywords: '占星博客, astrology blog, 星座教程, horoscope predictions, 占星知识, birth chart, transit chart, zodiac compatibility, free astrology',
  openGraph: {
    title: 'Astrology Blog - Free Astrology Knowledge | 星缘',
    description: 'Learn astrology for free: birth chart tutorials, transit predictions, zodiac personality analysis.',
    type: 'website',
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
