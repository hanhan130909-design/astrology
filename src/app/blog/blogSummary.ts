export interface BlogSummary {
  id: string;
  slug: string;
  category: string;
  categoryZh: string;
  categoryEn: string;
  categoryId: string;
  title: Record<string, string>;
  excerpt: Record<string, string>;
  author: string;
  authorEn: string;
  authorId: string;
  date: string;
  readTime: number;
  tags: string[];
}

export type BlogArticleForSummary = BlogSummary & { content?: unknown };

export function toBlogSummary(article: BlogArticleForSummary): BlogSummary {
  return {
    id: article.id,
    slug: article.slug,
    category: article.category,
    categoryZh: article.categoryZh,
    categoryEn: article.categoryEn,
    categoryId: article.categoryId,
    title: article.title,
    excerpt: article.excerpt,
    author: article.author,
    authorEn: article.authorEn,
    authorId: article.authorId,
    date: article.date,
    readTime: article.readTime,
    tags: article.tags,
  };
}
