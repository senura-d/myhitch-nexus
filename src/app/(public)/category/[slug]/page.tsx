import { categories } from "@/lib/mock-api/data/categories";
import { CategoryClient } from "./category-client";

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export default function CategoryPage() {
  return <CategoryClient />;
}
