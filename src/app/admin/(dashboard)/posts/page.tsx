import type { Metadata } from "next";
import Link from "next/link";
import { deletePost, setPostPublished } from "@/actions/posts";
import { ActionButton } from "@/components/admin/action-button";
import { AdminHeader, SavedNotice } from "@/components/admin/admin-header";
import { ButtonLink } from "@/components/ui/button";
import { requireAdmin } from "@/lib/auth";
import { formatDate } from "@/lib/markdown";
import { getPrisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Articles" };

export default async function AdminPostsPage({ searchParams }: PageProps<"/admin/posts">) {
  await requireAdmin();
  const { saved } = await searchParams;
  const posts = await getPrisma().post.findMany({
    orderBy: { updatedAt: "desc" },
    select: { id: true, title: true, status: true, publishedAt: true, updatedAt: true },
  });
  const now = new Date();
  const describe = (post: (typeof posts)[number]) => {
    if (post.status === "DRAFT" || !post.publishedAt) return `Draft, edited ${formatDate(post.updatedAt)}`;
    return `${post.publishedAt > now ? "Scheduled for" : "Published"} ${formatDate(post.publishedAt)}`;
  };
  return (
    <>
      <AdminHeader title="Articles">
        <ButtonLink href="/admin/posts/new">New article</ButtonLink>
      </AdminHeader>
      <SavedNotice show={saved === "1"} />
      {posts.length === 0 ? <p className="text-soft">Write an article. It stays a draft until you publish it.</p> : null}
      <ul>
        {posts.map((post) => {
          const published = post.status === "PUBLISHED";
          return (
            <li key={post.id} className="flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-line py-4">
              <div className="min-w-48 flex-1">
                <Link href={`/admin/posts/${post.id}`} className="text-lg font-bold underline-offset-4 hover:underline">
                  {post.title}
                </Link>
                <p className="text-sm text-soft">{describe(post)}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <ButtonLink href={`/admin/posts/${post.id}`} variant="outline" className="min-h-10 px-3.5 text-sm">
                  Edit
                </ButtonLink>
                <ActionButton action={setPostPublished.bind(null, post.id, !published)}>
                  {published ? "Unpublish" : "Publish"}
                </ActionButton>
                <ActionButton
                  variant="danger"
                  action={deletePost.bind(null, post.id)}
                  confirm={`Delete "${post.title}"? This can't be undone.`}
                >
                  Delete
                </ActionButton>
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}
