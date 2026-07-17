import BlogIndexClient from './BlogIndexClient';
import { getBlogSummaries } from './blogIndexData';

export default function BlogPage() {
  const articles = getBlogSummaries();
  return <BlogIndexClient articles={articles} />;
}
