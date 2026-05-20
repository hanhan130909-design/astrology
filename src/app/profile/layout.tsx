import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "个人中心 - 星缘 | Starry Fate",
  description:
    "查看和管理您保存的星盘，管理个人信息。View and manage your saved natal charts and profile information.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
