import type { Metadata } from "next";
import { AdminHeader } from "@/components/admin/admin-header";
import { ProjectForm } from "@/components/admin/project-form";
import { requireAdmin } from "@/lib/auth";
import { getPrisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "New project" };

export default async function NewProjectPage() {
  await requireAdmin();
  const last = await getPrisma().project.aggregate({ _max: { displayOrder: true } });
  return (
    <>
      <AdminHeader title="New project" />
      <ProjectForm
        project={{
          id: null,
          title: "",
          slug: "",
          category: "",
          shortDescription: "",
          description: "",
          problem: "",
          solution: "",
          features: [],
          content: "",
          coverImage: null,
          githubUrl: null,
          liveUrl: null,
          technologies: [],
          images: [],
          displayOrder: (last._max.displayOrder ?? -1) + 1,
          featured: false,
          published: false,
        }}
      />
    </>
  );
}
