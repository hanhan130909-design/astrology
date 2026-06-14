import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "大师咨询",
  description: "预约专业占星师一对一深度咨询，解答你的星盘疑惑。",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
