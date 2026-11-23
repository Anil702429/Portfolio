import Link from "next/link";
import { ProjectCover } from "@/components/project/cover";
import { CaseStudyLink, ExternalLinks } from "@/components/project/links";
import { Tags } from "@/components/ui/tags";
import type { ProjectSummary } from "@/types";

export function StandardCard({ project, mat }: { project: ProjectSummary; mat: number }) {
  const href = `/projects/${project.slug}`;
  return (
    <article className="group/card lg:sticky lg:top-28">
      <Link href={href} tabIndex={-1} aria-hidden="true" className="block">
        <ProjectCover project={project} mat={mat} sizes="(min-width: 1024px) 760px, 100vw" />
      </Link>
      <h2 className="mt-6 text-3xl sm:text-4xl">
        <Link href={href} className="transition-colors duration-300 group-hover/card:text-accent">
          {project.title}
        </Link>
      </h2>
      <p className="mt-3 max-w-lg text-lg text-soft">{project.shortDescription}</p>
      <Tags items={project.technologies.map((technology) => technology.name)} className="mt-4 text-soft" />
      <div className="mt-4 flex flex-wrap gap-x-7 font-semibold">
        <CaseStudyLink project={project} />
        <ExternalLinks project={project} />
      </div>
    </article>
  );
}
