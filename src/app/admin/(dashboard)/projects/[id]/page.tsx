import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminHeader } from "@/components/admin/admin-header";
import { ProjectForm } from "@/components/admin/project-form";
import { requireAdmin } from "@/lib/auth";
import { getPrisma } from "@/lib/prisma";
import { idSchema } from "@/lib/validation";

export const metadata: Metadata = { title: "Edit project" };

export default async function EditProjectPage({ params }: PageProps<"/admin/projects/[id]">) {
  await requireAdmin();
  const id = idSchema.safeParse((await params).id);
  if (!id.success) notFound();
  const project = await getPrisma().project.findUnique({
    where: { id: id.data },
    omit: { createdAt: true, updatedAt: true },
    include: {
      technologies: { select: { name: true }, orderBy: { name: "asc" } },
      images: { select: { url: true, alt: true }, orderBy: { displayOrder: "asc" } },
    },
  });
  if (!project) notFound();
  return (
    <>
      <AdminHeader title={`Edit ${project.title}`} />
      <ProjectForm project={{ ...project, technologies: project.technologies.map((item) => item.name) }} />
    </>
  );
}
