import { getBlogSummaries } from "../blogIndexData";
import BlogCategoryClient from "./BlogCategoryClient";

export default function BlogCategoriesPage() {
  const articles = getBlogSummaries();
  return <BlogCategoryClient articles={articles} />;
}
