import { tarotMetadata } from "@/lib/seoMetadata";

export const metadata = tarotMetadata;

export default function TarotLayout({
  children,
}: {
  children: React.ReactNode,
}) {
  return children;
}
