import Image from "next/image";
import Link from "next/link";
import type { ProjectSummary } from "@/types";

/** Cover image, or the project name set large when there is no image yet. */
export function ProjectCover({
  project,
  sizes,
  preload = false,
}: {
  project: Pick<ProjectSummary, "title" | "coverImage">;
  sizes: string;
  preload?: boolean;
}) {
  return (
    <div className="relative aspect-16/10 overflow-hidden rounded-md border border-line bg-tint">
      {project.coverImage ? (
        <Image
          src={project.coverImage}
          alt={`Screenshot of ${project.title}`}
          fill
          sizes={sizes}
          preload={preload}
          className="object-cover object-top"
        />
      ) : (
        <span className="absolute inset-0 grid place-items-center px-6 text-center text-3xl font-bold text-soft" aria-hidden="true">
          {project.title}
        </span>
      )}
    </div>
  );
}

export function ProjectLinks({ project }: { project: ProjectSummary }) {
  const links = [
    { label: "Live site", url: project.liveUrl },
    { label: "GitHub", url: project.githubUrl },
  ];
  return links.map(({ label, url }) =>
    url ? (
      <a
        key={label}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${project.title}: ${label}`}
        className="text-accent underline underline-offset-4 hover:text-accent-strong"
      >
        {label}
      </a>
    ) : null,
  );
}

export function ProjectCard({ project, preload = false }: { project: ProjectSummary; preload?: boolean }) {
  const href = `/projects/${project.slug}`;
  return (
    <article className="flex flex-col">
      <Link href={href} tabIndex={-1} aria-hidden="true">
        <ProjectCover project={project} sizes="(min-width: 768px) 540px, 100vw" preload={preload} />
      </Link>
      <h2 className="mt-5 text-2xl font-bold">
        <Link href={href} className="hover:text-accent">
          {project.title}
        </Link>
      </h2>
      <p className="mt-2 text-soft">{project.shortDescription}</p>
      <p className="mt-3 text-sm text-soft">{project.technologies.map((t) => t.name).join(", ")}</p>
      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 font-semibold">
        <Link href={href} className="text-accent underline underline-offset-4 hover:text-accent-strong">
          Read case study<span className="sr-only">: {project.title}</span>
        </Link>
        <ProjectLinks project={project} />
      </div>
    </article>
  );
}

export function FeaturedProject({ project }: { project: ProjectSummary }) {
  const href = `/projects/${project.slug}`;
  return (
    <article className="grid items-center gap-8 md:grid-cols-[7fr_5fr] md:gap-12 md:even:grid-cols-[5fr_7fr] md:even:[&>:first-child]:order-2">
      <Link href={href} tabIndex={-1} aria-hidden="true">
        <ProjectCover project={project} sizes="(min-width: 768px) 620px, 100vw" />
      </Link>
      <div>
        <h3 className="text-3xl font-bold">
          <Link href={href} className="hover:text-accent">
            {project.title}
          </Link>
        </h3>
        <p className="mt-3 text-lg text-soft">{project.shortDescription}</p>
        <p className="mt-4 text-sm text-soft">{project.technologies.map((t) => t.name).join(", ")}</p>
        <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 font-semibold">
          <Link href={href} className="text-accent underline underline-offset-4 hover:text-accent-strong">
            Read case study<span className="sr-only">: {project.title}</span>
          </Link>
          <ProjectLinks project={project} />
        </div>
      </div>
    </article>
  );
}
