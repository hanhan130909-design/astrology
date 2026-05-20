import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Astrology Community - Free Chart Sharing | 星缘',
  description: 'Join our astrology community to share charts, discuss horoscopes, and learn astrology with others.',
};

export default function CommunityLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
