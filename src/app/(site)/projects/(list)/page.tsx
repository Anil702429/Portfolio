import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { ProjectCard } from "@/components/project-card";
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
  const active = technologies.find((technology) => technology.slug === tech);
  const visible = active
    ? projects.filter((project) => project.technologies.some((t) => t.slug === active.slug))
    : projects;

  const filterClass = (selected: boolean) =>
    `inline-flex min-h-10 items-center rounded-md border px-3.5 text-sm font-medium ${
      selected ? "border-cobalt bg-cobalt text-white" : "border-line hover:bg-tint"
    }`;

  return (
    <>
      <PageHeader title="Projects">
        <p>Web applications I have designed and built, with notes on how they work.</p>
      </PageHeader>
      <div className="container-page py-14 sm:py-20">
        {technologies.length ? (
          <nav aria-label="Filter by technology" className="mb-12 flex flex-wrap gap-2">
            <Link href="/projects" className={filterClass(!active)} aria-current={active ? undefined : "true"} scroll={false}>
              All
            </Link>
            {technologies.map((technology) => (
              <Link
                key={technology.slug}
                href={`/projects?tech=${encodeURIComponent(technology.slug)}`}
                className={filterClass(technology === active)}
                aria-current={technology === active ? "true" : undefined}
                scroll={false}
              >
                {technology.name}
              </Link>
            ))}
          </nav>
        ) : null}
        {visible.length ? (
          <div className="grid gap-x-10 gap-y-16 md:grid-cols-2">
            {visible.map((project, index) => (
              <ProjectCard key={project.slug} project={project} preload={index === 0} />
            ))}
          </div>
        ) : (
          <p className="text-lg text-soft">No projects are published yet.</p>
        )}
      </div>
    </>
  );
}
