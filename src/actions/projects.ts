"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { databaseError, invalid, isNotFound } from "@/lib/errors";
import { getPrisma } from "@/lib/prisma";
import { removeUploads } from "@/lib/supabase/storage";
import { fieldErrors, idSchema, projectSchema } from "@/lib/validation";
import type { ActionState } from "@/types";

/** Creates a project when id is null, otherwise updates it. */
export async function saveProject(
  id: string | null,
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  if (id !== null && !idSchema.safeParse(id).success) {
    return { ok: false, message: "This project no longer exists." };
  }
  const parsed = projectSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return invalid(fieldErrors(parsed.error));

  const { technologies, images, ...data } = parsed.data;
  const connectOrCreate = technologies.map((technology) => ({
    where: { slug: technology.slug },
    create: technology,
  }));
  const imageRows = images.map((image, displayOrder) => ({ ...image, displayOrder }));
  let replaced: string[] = [];

  try {
    const prisma = getPrisma();
    if (id === null) {
      await prisma.project.create({
        data: { ...data, technologies: { connectOrCreate }, images: { create: imageRows } },
      });
    } else {
      const before = await prisma.project.findUniqueOrThrow({
        where: { id },
        select: { coverImage: true, images: { select: { url: true } } },
      });
      await prisma.project.update({
        where: { id },
        data: {
          ...data,
          technologies: { set: [], connectOrCreate },
          images: { deleteMany: {}, create: imageRows },
        },
      });
      const kept = new Set([data.coverImage, ...images.map((image) => image.url)]);
      replaced = [before.coverImage ?? "", ...before.images.map((image) => image.url)].filter(
        (url) => url && !kept.has(url) && !data.content.includes(url),
      );
    }
    await prisma.technology.deleteMany({ where: { projects: { none: {} } } });
  } catch (error) {
    return databaseError(error);
  }

  await removeUploads(replaced);
  revalidatePath("/", "layout");
  redirect("/admin/projects?saved=1");
}

export async function setProjectPublished(id: string, published: boolean): Promise<void> {
  await requireAdmin();
  await getPrisma().project.updateMany({
    where: { id: idSchema.parse(id) },
    data: { published: published === true },
  });
  revalidatePath("/", "layout");
}

export async function deleteProject(id: string): Promise<void> {
  await requireAdmin();
  try {
    const prisma = getPrisma();
    const project = await prisma.project.delete({
      where: { id: idSchema.parse(id) },
      select: { coverImage: true, images: { select: { url: true } } },
    });
    await prisma.technology.deleteMany({ where: { projects: { none: {} } } });
    await removeUploads([project.coverImage, ...project.images.map((image) => image.url)]);
  } catch (error) {
    if (!isNotFound(error)) throw error;
  }
  revalidatePath("/", "layout");
  redirect("/admin/projects");
}
