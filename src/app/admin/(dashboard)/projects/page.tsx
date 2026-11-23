import type { Metadata } from "next";
import Link from "next/link";
import { deleteProject, setProjectPublished } from "@/actions/projects";
import { ActionButton } from "@/components/admin/action-button";
import { AdminHeader, SavedNotice } from "@/components/admin/admin-header";
import { ButtonLink } from "@/components/ui/button";
import { requireAdmin } from "@/lib/auth";
import { getPrisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Projects" };

export default async function AdminProjectsPage({ searchParams }: PageProps<"/admin/projects">) {
  await requireAdmin();
  const { saved } = await searchParams;
  const projects = await getPrisma().project.findMany({
    orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
    select: { id: true, title: true, published: true, featured: true, displayOrder: true },
  });
  return (
    <>
      <AdminHeader title="Projects">
        <ButtonLink href="/admin/projects/new">New project</ButtonLink>
      </AdminHeader>
      <SavedNotice show={saved === "1"} />
      {projects.length === 0 ? <p className="text-soft">Create a project to show it on the site.</p> : null}
      <ul>
        {projects.map((project) => (
          <li key={project.id} className="flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-line py-4">
            <div className="min-w-48 flex-1">
              <Link href={`/admin/projects/${project.id}`} className="text-lg font-bold underline-offset-4 hover:underline">
                {project.title}
              </Link>
              <p className="text-sm text-soft">
                {project.published ? "Published" : "Hidden"}
                {project.featured ? ", featured" : ""}, order {project.displayOrder}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <ButtonLink href={`/admin/projects/${project.id}`} variant="outline" className="min-h-10 px-3.5 text-sm">
                Edit
              </ButtonLink>
              <ActionButton action={setProjectPublished.bind(null, project.id, !project.published)}>
                {project.published ? "Unpublish" : "Publish"}
              </ActionButton>
              <ActionButton
                variant="danger"
                action={deleteProject.bind(null, project.id)}
                confirm={`Delete "${project.title}"? Its images are deleted too. This can't be undone.`}
              >
                Delete
              </ActionButton>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
