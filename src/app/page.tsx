import HomePageClient from "@/components/HomePageClient";
import { homeMetadata } from "@/lib/seoMetadata";

export const metadata = homeMetadata;

export default function HomePage() {
  return <HomePageClient />;
}
