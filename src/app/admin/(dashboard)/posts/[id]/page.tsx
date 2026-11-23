import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminHeader } from "@/components/admin/admin-header";
import { PostForm } from "@/components/admin/post-form";
import { requireAdmin } from "@/lib/auth";
import { getPrisma } from "@/lib/prisma";
import { idSchema } from "@/lib/validation";

export const metadata: Metadata = { title: "Edit article" };

export default async function EditPostPage({ params }: PageProps<"/admin/posts/[id]">) {
  await requireAdmin();
  const id = idSchema.safeParse((await params).id);
  if (!id.success) notFound();
  const prisma = getPrisma();
  const [post, categories] = await Promise.all([
    prisma.post.findUnique({
      where: { id: id.data },
      include: { category: { select: { name: true } }, tags: { select: { name: true }, orderBy: { name: "asc" } } },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" }, select: { name: true } }),
  ]);
  if (!post) notFound();
  return (
    <>
      <AdminHeader title={`Edit ${post.title}`} />
      <PostForm
        categories={categories.map((category) => category.name)}
        post={{
          id: post.id,
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content,
          coverImage: post.coverImage,
          category: post.category?.name ?? "",
          tags: post.tags.map((tag) => tag.name),
          status: post.status,
          publishedAt: post.publishedAt?.toISOString().slice(0, 16) ?? "",
        }}
      />
    </>
  );
}
