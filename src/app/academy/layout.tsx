import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "占星学院 - 系统课程",
  description: "系统学习占星学，从入门到精通的专业占星课程体系。",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
