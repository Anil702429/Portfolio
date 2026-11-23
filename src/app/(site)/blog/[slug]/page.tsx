import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/json-ld";
import { Markdown } from "@/components/markdown";
import { PageHeader } from "@/components/page-header";
import { PostCard } from "@/components/post-card";
import { getSiteUrl } from "@/lib/env";
import { extractHeadings, formatDate } from "@/lib/markdown";
import { getPost, getRelatedPosts, getSettings } from "@/lib/queries";
import { decodeSlug } from "@/lib/slug";

export const revalidate = 300;

/** Pages are rendered on first visit, then cached. */
export function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const post = await getPost(decodeSlug((await params).slug));
  if (!post) return { title: "Page not found", robots: { index: false } };
  const canonical = `/blog/${post.slug}`;
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      url: canonical,
      publishedTime: post.publishedAt.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      tags: post.tags.map((tag) => tag.name),
      images: [post.coverImage ?? "/opengraph-image"],
    },
  };
}

export default async function PostPage({ params }: PageProps<"/blog/[slug]">) {
  const post = await getPost(decodeSlug((await params).slug));
  if (!post) notFound();
  const [related, settings] = await Promise.all([getRelatedPosts(post), getSettings()]);
  const headings = extractHeadings(post.content);
  const showContents = headings.length >= 3;

  return (
    <article>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: post.excerpt,
          datePublished: post.publishedAt.toISOString(),
          dateModified: post.updatedAt.toISOString(),
          author: { "@type": "Person", name: settings.name, url: getSiteUrl() },
          mainEntityOfPage: `${getSiteUrl()}/blog/${post.slug}`,
        }}
      />
      <PageHeader title={post.title}>
        <p>{post.excerpt}</p>
        <p className="mt-5 text-base">
          <time dateTime={post.publishedAt.toISOString()}>{formatDate(post.publishedAt)}</time>, {post.readingMinutes}{" "}
          min read
          {post.category ? (
            <>
              , in{" "}
              <Link href={`/blog?category=${encodeURIComponent(post.category.slug)}`} className="underline underline-offset-4">
                {post.category.name}
              </Link>
            </>
          ) : null}
        </p>
      </PageHeader>

      <div className={`container-page py-12 sm:py-16 ${showContents ? "grid gap-10 lg:grid-cols-[1fr_15rem] lg:gap-16" : ""}`}>
        {showContents ? (
          <nav aria-label="On this page" className="lg:order-2">
            <div className="lg:sticky lg:top-24">
              <h2 className="font-bold">On this page</h2>
              <ul className="mt-3 space-y-2 text-sm">
                {headings.map((heading) => (
                  <li key={heading.id} className={heading.level === 3 ? "pl-4" : ""}>
                    <a href={`#${heading.id}`} className="text-soft hover:text-accent">
                      {heading.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        ) : null}
        <div className="min-w-0">
          {post.coverImage ? (
            <div className="relative mb-12 aspect-16/9 max-w-176 overflow-hidden rounded-md">
              <Image src={post.coverImage} alt="" fill preload sizes="(min-width: 768px) 704px, 100vw" className="object-cover" />
            </div>
          ) : null}
          <Markdown>{post.content}</Markdown>
          {post.tags.length ? (
            <ul className="mt-12 flex flex-wrap gap-2" aria-label="Tags">
              {post.tags.map((tag) => (
                <li key={tag.slug}>
                  <Link
                    href={`/blog?tag=${encodeURIComponent(tag.slug)}`}
                    className="inline-flex min-h-9 items-center rounded-md border border-line px-3 text-sm font-medium hover:bg-tint"
                  >
                    {tag.name}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>

      {related.length ? (
        <section className="bg-tint py-14">
          <div className="container-page">
            <h2 className="mb-8 text-3xl font-bold">Related articles</h2>
            {related.map((item) => (
              <PostCard key={item.slug} post={item} heading="h3" />
            ))}
          </div>
        </section>
      ) : null}
    </article>
  );
}
