/**
 * Dynamic Blog Article Page — /blog/[slug]
 * Renders individual Destiny Code articles with markdown-like content
 */
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { destinyArticles, BlogArticle } from '@/content/destiny-blog-articles';
import { seoArticles } from '../seo-articles';
import { ArrowLeft, Clock, Tag } from 'lucide-react';

interface Props {
  params: Promise<{ slug: string }>;
}

// Generate static params for all articles
export function generateStaticParams() {
  const destiny = destinyArticles.map((a: BlogArticle) => ({ slug: a.slug }));
  const seo = seoArticles.map((a: any) => ({ slug: a.slug }));
  return [...destiny, ...seo];
}

// Dynamic metadata
export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const { slug } = await params;
  const article = destinyArticles.find((a: BlogArticle) => a.slug === slug) 
    || seoArticles.find((a: any) => a.slug === slug);
  if (!article) { notFound(); }

  return {
    title: `${article.title?.en || article.title || 'Article'} | 星缘 Blog`,
    description: article.excerpt?.en || article.description?.en || article.description,
    openGraph: {
      title: article.title?.en || article.title,
      description: article.excerpt?.en || article.description?.en || article.description,
      type: 'article',
    },
    alternates: {
      canonical: `https://lunaxstar.com/blog/${slug}`,
    },
  };
}

// Simple markdown renderer (headings, paragraphs, bold, italic, links, lists)
function renderContent(content: string) {
  const blocks = content.split('\n\n');
  
  return blocks.map((block: string, i: number) => {
    // Headings
    if (block.startsWith('### ')) {
      return (
        <h3 key={i} className="text-xl font-bold mt-8 mb-3 text-gray-900 dark:text-gray-100">
          {block.replace('### ', '')}
        </h3>
      );
    }
    if (block.startsWith('## ')) {
      return (
        <h2 key={i} className="text-2xl font-bold mt-10 mb-4 text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2">
          {block.replace('## ', '')}
        </h2>
      );
    }
    if (block.startsWith('# ')) {
      return (
        <h1 key={i} className="text-3xl font-extrabold mt-6 mb-4 text-gray-900 dark:text-white">
          {block.replace('# ', '')}
        </h1>
      );
    }

    // List items
    if (block.includes('\n• ')) {
      const items = block.split('\n• ').filter(Boolean);
      return (
        <ul key={i} className="list-disc pl-6 my-4 space-y-2 text-gray-700 dark:text-gray-300">
          {items.map((item: string, j: number) => (
            <li key={j}>{renderInline(item)}</li>
          ))}
        </ul>
      );
    }

    // Regular paragraph with inline formatting
    return (
      <p key={i} className="my-4 text-gray-700 dark:text-gray-300 leading-relaxed">
        {renderInline(block)}
      </p>
    );
  });
}

// Inline formatting: **bold**, *italic*, [link](url)
function renderInline(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let idx = 0;

  while (remaining.length > 0) {
    // Bold **...**
    const boldMatch = remaining.match(/^(.*?)\*\*(.+?)\*\*/);
    if (boldMatch) {
      if (boldMatch[1]) parts.push(boldMatch[1]);
      parts.push(<strong key={`b-${idx}`}>{boldMatch[2]}</strong>);
      remaining = remaining.slice(boldMatch[0].length);
      idx++;
      continue;
    }

    // Italic *...*
    const italicMatch = remaining.match(/^(.*?)\*(.+?)\*/);
    if (italicMatch) {
      if (italicMatch[1]) parts.push(italicMatch[1]);
      parts.push(<em key={`i-${idx}`}>{italicMatch[2]}</em>);
      remaining = remaining.slice(italicMatch[0].length);
      idx++;
      continue;
    }

    // Link [...](url)
    const linkMatch = remaining.match(/^(.*?)\[(.+?)\]\((.+?)\)/);
    if (linkMatch) {
      if (linkMatch[1]) parts.push(linkMatch[1]);
      parts.push(
        <a key={`a-${idx}`} href={linkMatch[3]} className="text-blue-600 dark:text-blue-400 hover:underline" target="_blank" rel="noopener">
          {linkMatch[2]}
        </a>
      );
      remaining = remaining.slice(linkMatch[0].length);
      idx++;
      continue;
    }

    // Line break
    if (remaining.startsWith('---')) {
      parts.push(<hr key={`hr-${idx}`} className="my-8 border-gray-200 dark:border-gray-700" />);
      remaining = remaining.slice(3);
      idx++;
      continue;
    }

    // Plain text
    parts.push(remaining);
    break;
  }

  return <>{parts}</>;
}

export default async function BlogArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = destinyArticles.find((a: BlogArticle) => a.slug === slug);
  
  if (!article) notFound();

  const readTime = article.readTime || Math.ceil((article.wordCount || 1) / 200);
  const categoryLabel = article.categoryLabel?.en || article.categoryEn || article.category;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <article className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        {/* Back navigation */}
        <Link 
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mb-8 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Blog
        </Link>

        {/* Article header */}
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
              <Tag size={12} />
              {categoryLabel}
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
              <Clock size={12} />
              {readTime} min read
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white leading-tight">
            {article.title?.en || article.title?.zh || article.title}
          </h1>
          {(article.excerpt?.en || article.description?.en) && (
            <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
              {article.excerpt?.en || article.description?.en}
            </p>
          )}
        </header>

        {/* Article content */}
        <div className="prose prose-lg dark:prose-invert max-w-none
          prose-headings:text-gray-900 dark:prose-headings:text-gray-100
          prose-p:text-gray-700 dark:prose-p:text-gray-300
          prose-a:text-blue-600 dark:prose-a:text-blue-400
          prose-strong:text-gray-900 dark:prose-strong:text-gray-100
        ">
          {renderContent(article.sections || article.content?.en || article.content?.zh || '')}
        </div>

        {/* CTA Footer */}
        <div className="mt-16 p-8 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-2xl border border-purple-100 dark:border-purple-800/30 text-center">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
            Discover Your Cosmic Blueprint
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
            Generate your free BaZi chart on lunaxstar.com to see what the stars reveal about your destiny.
          </p>
          <Link
            href="/bazi"
            className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors shadow-lg shadow-purple-500/25"
          >
            Free BaZi Calculator →
          </Link>
        </div>
      </article>
    </div>
  );
}
