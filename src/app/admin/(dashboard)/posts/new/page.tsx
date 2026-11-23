import type { Metadata } from "next";
import { AdminHeader } from "@/components/admin/admin-header";
import { PostForm } from "@/components/admin/post-form";
import { requireAdmin } from "@/lib/auth";
import { getPrisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "New article" };

export default async function NewPostPage() {
  await requireAdmin();
  const categories = await getPrisma().category.findMany({ orderBy: { name: "asc" }, select: { name: true } });
  return (
    <>
      <AdminHeader title="New article" />
      <PostForm
        categories={categories.map((category) => category.name)}
        post={{
          id: null,
          title: "",
          slug: "",
          excerpt: "",
          content: "",
          coverImage: null,
          category: "",
          tags: [],
          status: "DRAFT",
          publishedAt: "",
        }}
      />
    </>
  );
}
