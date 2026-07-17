import { blogMetadata } from "@/lib/seoMetadata";

export const metadata = blogMetadata;

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
