import { notFound } from "next/navigation";
import { draftMode } from "next/headers";
import { buildMetadata } from "@/lib/seo";
import { paths } from "@/lib/url";
import {
  getAllArticleParams,
  getArticleBySlug,
  getRelatedArticles,
} from "@/server/content";
import { getApprovedComments } from "@/server/engagement";
import { ArticleView } from "@/components/content/article-view";

export const revalidate = 3600;

export async function generateStaticParams() {
  return getAllArticleParams("blog");
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article || article.type !== "BLOG") return {};
  return buildMetadata({
    title: article.metaTitle ?? article.title,
    description: article.metaDescription ?? article.excerpt ?? undefined,
    path: paths.article(slug),
    image: article.coverImage ?? undefined,
    type: "article",
    publishedTime: article.publishedAt?.toISOString(),
    modifiedTime: article.updatedAt.toISOString(),
    authors: article.author?.name ? [article.author.name] : undefined,
  });
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { isEnabled: preview } = await draftMode();
  const article = await getArticleBySlug(slug, preview);
  if (!article || article.type !== "BLOG") notFound();

  const [related, comments] = await Promise.all([
    getRelatedArticles(
      article.id,
      article.categories.map((c) => c.id),
      3,
    ),
    getApprovedComments("ARTICLE", article.id),
  ]);

  return (
    <ArticleView
      section="blog"
      article={article}
      related={related}
      comments={comments}
    />
  );
}
