"use client";

import { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

interface SearchResult {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
}

export default function BlogSearch() {
  const { language } = useLanguage();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const placeholder =
    language === "zh" ? "搜索文章..." :
    language === "en" ? "Search articles..." :
    "Search...";

  const search = async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/blog/search?q=${encodeURIComponent(q)}&lang=${language}`);
      const data = await res.json();
      setResults(data.results || []);
    } catch {
      setResults([]);
    }
    setLoading(false);
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    setOpen(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => search(val), 300);
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
    setOpen(false);
    inputRef.current?.focus();
  };

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".blog-search-container")) setOpen(false);
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  return (
    <div className="blog-search-container relative w-full max-w-xl mx-auto mb-8">
      <div className="relative">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInput}
          onFocus={() => { if (results.length > 0) setOpen(true); }}
          placeholder={placeholder}
          className="w-full pl-11 pr-10 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all"
        />
        {query && (
          <button onClick={handleClear} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            <X size={14} />
          </button>
        )}
      </div>

      {/* Results dropdown */}
      {open && results.length > 0 && (
        <div className="absolute top-full mt-2 left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-lg max-h-[400px] overflow-y-auto z-50">
          {results.map((r) => (
            <Link
              key={r.slug}
              href={`/blog/${r.slug}`}
              onClick={() => setOpen(false)}
              className="block px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-0 transition-colors"
            >
              <div className="text-sm font-medium text-gray-900 line-clamp-1">{r.title}</div>
              <div className="text-xs text-gray-500 mt-0.5 line-clamp-1">{r.excerpt}</div>
            </Link>
          ))}
        </div>
      )}

      {/* No results */}
      {open && query && !loading && results.length === 0 && (
        <div className="absolute top-full mt-2 left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-lg p-6 text-center z-50">
          <p className="text-sm text-gray-400">
            {language === "zh" ? "没有找到相关文章" : "No articles found"}
          </p>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="absolute top-full mt-2 left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-lg p-4 text-center z-50">
          <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin mx-auto" />
        </div>
      )}
    </div>
  );
}
