import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { ProjectGallery } from "@/components/project/gallery";
import { getProjects } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Projects",
  description: "Web applications I have designed and built, with notes on how they work.",
  alternates: { canonical: "/projects" },
};

export default async function ProjectsPage({ searchParams }: PageProps<"/projects">) {
  const { tech } = await searchParams;
  const projects = await getProjects();
  const technologies = [...new Map(projects.flatMap((p) => p.technologies).map((t) => [t.slug, t])).values()].sort(
    (a, b) => a.name.localeCompare(b.name),
  );
  const initial = technologies.find((technology) => technology.slug === tech)?.slug ?? null;

  return (
    <>
      <PageHeader title="Projects">
        <p>Web applications I have designed and built, with notes on how they work.</p>
      </PageHeader>
      <div className="container-page py-14 sm:py-20">
        {projects.length ? (
          <ProjectGallery key={initial} projects={projects} technologies={technologies} initial={initial} />
        ) : (
          <p className="text-lg text-soft">No projects are published yet.</p>
        )}
      </div>
    </>
  );
}
