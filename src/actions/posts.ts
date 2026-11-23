"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { databaseError, invalid, isNotFound } from "@/lib/errors";
import { getPrisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";
import { removeUploads } from "@/lib/supabase/storage";
import { fieldErrors, idSchema, postSchema } from "@/lib/validation";
import type { ActionState } from "@/types";

async function removeUnusedTaxonomy() {
  const prisma = getPrisma();
  await prisma.tag.deleteMany({ where: { posts: { none: {} } } });
  await prisma.category.deleteMany({ where: { posts: { none: {} } } });
}

/** Creates an article when id is null, otherwise updates it. */
export async function savePost(
  id: string | null,
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  if (id !== null && !idSchema.safeParse(id).success) {
    return { ok: false, message: "This article no longer exists." };
  }
  const parsed = postSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return invalid(fieldErrors(parsed.error));

  const { tags, category, publishedAt, ...fields } = parsed.data;
  const data = {
    ...fields,
    publishedAt: publishedAt ?? (fields.status === "PUBLISHED" ? new Date() : null),
  };
  const connectTags = tags.map((tag) => ({ where: { slug: tag.slug }, create: tag }));
  const categorySlug = slugify(category);
  const connectCategory = {
    where: { slug: categorySlug },
    create: { name: category, slug: categorySlug },
  };
  let replaced: string | null = null;

  try {
    const prisma = getPrisma();
    if (id === null) {
      await prisma.post.create({
        data: {
          ...data,
          tags: { connectOrCreate: connectTags },
          category: categorySlug ? { connectOrCreate: connectCategory } : undefined,
        },
      });
    } else {
      const before = await prisma.post.findUniqueOrThrow({
        where: { id },
        select: { coverImage: true },
      });
      await prisma.post.update({
        where: { id },
        data: {
          ...data,
          tags: { set: [], connectOrCreate: connectTags },
          category: categorySlug ? { connectOrCreate: connectCategory } : { disconnect: true },
        },
      });
      const stillUsed =
        before.coverImage === data.coverImage || data.content.includes(before.coverImage ?? "\0");
      replaced = stillUsed ? null : before.coverImage;
    }
    await removeUnusedTaxonomy();
  } catch (error) {
    return databaseError(error);
  }

  await removeUploads([replaced]);
  revalidatePath("/", "layout");
  redirect("/admin/posts?saved=1");
}

export async function setPostPublished(id: string, published: boolean): Promise<void> {
  await requireAdmin();
  const postId = idSchema.parse(id);
  const prisma = getPrisma();
  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: { publishedAt: true, content: true },
  });
  // Empty articles can only be published after they are written.
  if (post && (published !== true || post.content)) {
    await prisma.post.updateMany({
      where: { id: postId },
      data: published === true
        ? { status: "PUBLISHED", publishedAt: post.publishedAt ?? new Date() }
        : { status: "DRAFT" },
    });
  }
  revalidatePath("/", "layout");
}

export async function deletePost(id: string): Promise<void> {
  await requireAdmin();
  try {
    const post = await getPrisma().post.delete({
      where: { id: idSchema.parse(id) },
      select: { coverImage: true },
    });
    await removeUnusedTaxonomy();
    await removeUploads([post.coverImage]);
  } catch (error) {
    if (!isNotFound(error)) throw error;
  }
  revalidatePath("/", "layout");
  redirect("/admin/posts");
}
