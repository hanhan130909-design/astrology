import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI 星盘解读",
  description: "基于大语言模型的AI占星解读引擎，输入出生信息即刻生成个性化深度星盘分析报告。",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
