import Link from 'next/link';
import { destinyArticles } from '@/content/destiny-blog-articles';
import { seoArticles } from '@/app/blog/seo-articles';
import { moreSeoArticles } from '@/app/blog/more-seo-articles';
import { longtailSeoArticles } from '@/app/blog/longtail-seo-articles';
import { longtailSeoArticlesBatch2 } from '@/app/blog/longtail-seo-articles-batch2';
import { longtailSeoArticlesBatch3 } from '@/app/blog/longtail-seo-articles-batch3';

const allArticles = [
  ...destinyArticles,
  ...seoArticles,
  ...moreSeoArticles,
  ...longtailSeoArticles,
  ...longtailSeoArticlesBatch2,
  ...longtailSeoArticlesBatch3,
];

interface RelatedArticlesProps {
  currentSlug: string;
  categoryLabel: string;
  maxItems?: number;
}

export default function RelatedArticles({ currentSlug, categoryLabel, maxItems = 3 }: RelatedArticlesProps) {
  // Find articles in same category, exclude current
  const sameCategory = allArticles.filter(
    (a) =>
      a.slug !== currentSlug &&
      (a.categoryLabel?.en === categoryLabel ||
        a.categoryLabel?.zh === categoryLabel ||
        a.category === categoryLabel.toLowerCase())
  );

  // If not enough same-category, fill with any articles
  let related = sameCategory.slice(0, maxItems);
  if (related.length < maxItems) {
    const others = allArticles.filter(
      (a) => a.slug !== currentSlug && !related.find((r) => r.slug === a.slug)
    );
    // Shuffle and pick
    const shuffled = others.sort(() => 0.5 - Math.random());
    related = [...related, ...shuffled.slice(0, maxItems - related.length)];
  }

  if (related.length === 0) return null;

  const getTitle = (article: any) => {
    if (typeof article.title === 'string') return article.title;
    return article.title?.en || article.title?.zh || article.slug;
  };

  const getCategory = (article: any) => {
    if (typeof article.categoryLabel === 'string') return article.categoryLabel;
    return article.categoryLabel?.en || article.categoryLabel?.zh || article.category || 'Article';
  };

  return (
    <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
        You Might Also Like
      </h3>
      <div className="grid gap-4">
        {related.map((article: any, i: number) => (
          <Link
            key={article.slug}
            href={`/blog/${article.slug}`}
            className="group flex items-start gap-4 p-4 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-amber-200 dark:hover:border-amber-900 hover:bg-amber-50/50 dark:hover:bg-amber-950/20 transition-all"
          >
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold text-sm">
              {String(i + 1).padStart(2, '0')}
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-xs text-amber-600 dark:text-amber-400 font-medium uppercase tracking-wide">
                {getCategory(article)}
              </span>
              <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white leading-snug mt-1 line-clamp-2">
                {getTitle(article)}
              </h4>
            </div>
            <span className="flex-shrink-0 text-gray-300 group-hover:text-amber-500 transition-colors mt-1">
              →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
