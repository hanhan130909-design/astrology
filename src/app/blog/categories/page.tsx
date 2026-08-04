import { getBlogSummaries } from "../blogIndexData";
import BlogCategoryClient from "./BlogCategoryClient";

export const dynamic = "force-dynamic";

export default function BlogCategoriesPage() {
  const articles = getBlogSummaries();
  return <BlogCategoryClient articles={articles} />;
}
