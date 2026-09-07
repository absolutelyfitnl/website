import { permanentRedirect } from "next/navigation";
import { articles } from "@/lib/content/articles";

export function generateStaticParams() { return articles.map(({ slug }) => ({ slug })); }
export const dynamicParams = false;

export default async function LegacyArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  permanentRedirect(`/kennisbank/${slug}`);
}
