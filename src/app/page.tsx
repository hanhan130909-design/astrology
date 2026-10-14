import HomePageClient from "@/components/HomePageClient";
import { homeMetadata } from "@/lib/seoMetadata";

export const metadata = homeMetadata;

// Force static rendering for homepage — no dynamic dependencies
export const dynamic = "force-static";

export default function HomePage() {
  return <HomePageClient />;
}
