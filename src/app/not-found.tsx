import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <p className="text-8xl font-extralight text-gray-200 mb-4">404</p>
        <h1 className="text-xl font-semibold text-gray-900 mb-2">页面未找到</h1>
        <p className="text-sm text-gray-500 mb-8">你访问的页面不存在或已被移动</p>
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <Link href="/natal" className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-600 hover:bg-gray-100">免费生成星盘</Link>
          <Link href="/bazi" className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-600 hover:bg-gray-100">八字排盘</Link>
          <Link href="/blog" className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-600 hover:bg-gray-100">占星博客</Link>
          <Link href="/community" className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-600 hover:bg-gray-100">占星社区</Link>
        </div>
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-700 underline">← 返回首页</Link>
      </div>
    </div>
  );
}
