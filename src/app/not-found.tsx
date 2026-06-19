import Link from 'next/link';

const links = [
  { href: "/natal", label: "免费生成星盘" },
  { href: "/bazi", label: "八字排盘" },
  { href: "/horoscope", label: "每日运势" },
  { href: "/compatibility", label: "配对分析" },
  { href: "/blog", label: "占星博客" },
];

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <p className="text-8xl font-extralight text-gray-300 mb-4">404</p>
        <h1 className="text-xl font-semibold text-gray-900 mb-2">页面未找到</h1>
        <p className="text-sm text-gray-500 mb-8">你访问的页面不存在或已被移动</p>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {links.map(l => (
            <Link key={l.href} href={l.href}
              className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-600 hover:bg-gray-100 transition-colors">
              {l.label}
            </Link>
          ))}
        </div>

        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-gray-900 font-medium hover:text-gray-600">
          ← 返回首页
        </Link>
      </div>
    </div>
  );
}
