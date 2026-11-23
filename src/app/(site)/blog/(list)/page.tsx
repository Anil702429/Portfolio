import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { PostCard } from "@/components/post-card";
import { Button } from "@/components/ui/button";
import { getPostFacets, getPosts } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Blog",
  description: "Technical articles about Python, Django and building software.",
  alternates: { canonical: "/blog" },
};

const one = (value: string | string[] | undefined) =>
  (Array.isArray(value) ? value[0] : value)?.trim().slice(0, 100) || undefined;

export default async function BlogPage({ searchParams }: PageProps<"/blog">) {
  const params = await searchParams;
  const filters = { q: one(params.q), category: one(params.category), tag: one(params.tag) };
  const [posts, facets] = await Promise.all([getPosts(filters), getPostFacets()]);
  const filtered = Boolean(filters.q || filters.category || filters.tag);
  const empty = posts.length === 0 && !filtered;

  const chip = (selected: boolean) =>
    `label inline-flex min-h-10 items-center rounded-[3px] border px-3 transition-colors ${
      selected ? "border-cobalt bg-cobalt text-white" : "border-line hover:border-text"
    }`;

  return (
    <>
      <PageHeader title="Blog">
        <p>Technical articles about Python, Django and building software.</p>
      </PageHeader>
      <div className="container-page py-14 sm:py-20">
        {empty ? (
          <p className="text-lg text-soft">No articles are published yet.</p>
        ) : (
          <div className="grid gap-12 lg:grid-cols-[1fr_16rem] lg:gap-16">
            <div className="order-2 lg:order-1">
              {posts.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
              {posts.length === 0 ? (
                <p className="text-lg text-soft">No articles match. Try another search, or clear the filters.</p>
              ) : null}
            </div>
            <aside className="order-1 space-y-8 lg:order-2">
              <form action="/blog" role="search" className="flex gap-2">
                <label htmlFor="q" className="sr-only">
                  Search articles
                </label>
                <input
                  id="q"
                  name="q"
                  type="search"
                  defaultValue={filters.q}
                  placeholder="Search articles"
                  className="min-h-11 w-full min-w-0 rounded-[3px] border border-line bg-surface px-3.5"
                />
                <Button type="submit">Search</Button>
              </form>
              {filtered ? (
                <Link href="/blog" className="inline-block font-semibold text-accent underline underline-offset-4">
                  Clear filters
                </Link>
              ) : null}
              {(["category", "tag"] as const).map((kind) => {
                const items = kind === "category" ? facets.categories : facets.tags;
                return items.length ? (
                  <nav key={kind} aria-label={kind === "category" ? "Categories" : "Tags"}>
                    <h2 className="mb-3 font-bold">{kind === "category" ? "Categories" : "Tags"}</h2>
                    <div className="flex flex-wrap gap-2">
                      {items.map((item) => (
                        <Link
                          key={item.slug}
                          href={`/blog?${kind}=${encodeURIComponent(item.slug)}`}
                          className={chip(filters[kind] === item.slug)}
                          aria-current={filters[kind] === item.slug ? "true" : undefined}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </nav>
                ) : null;
              })}
            </aside>
          </div>
        )}
      </div>
    </>
  );
}
