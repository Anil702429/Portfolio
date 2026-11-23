import Link from "next/link";
import { Arrow } from "@/components/ui/arrow";
import type { ProjectSummary } from "@/types";

const style = "group inline-flex min-h-11 items-center gap-2 transition-colors duration-300 hover:text-accent";

/** Repository and demo, when the project has them. */
export function ExternalLinks({ project }: { project: ProjectSummary }) {
  return [
    { label: "Live site", url: project.liveUrl },
    { label: "GitHub", url: project.githubUrl },
  ].map(({ label, url }) =>
    url ? (
      <a
        key={label}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${project.title}: ${label}`}
        className={style}
      >
        <span className="link">{label}</span>
        <Arrow external />
      </a>
    ) : null,
  );
}

export function CaseStudyLink({ project }: { project: ProjectSummary }) {
  return (
    <Link href={`/projects/${project.slug}`} className={style}>
      <span className="link">
        Read case study<span className="sr-only">: {project.title}</span>
      </span>
      <Arrow />
    </Link>
  );
}

/** Larger call to action that fills from the left. */
export function CaseStudyButton({ project }: { project: ProjectSummary }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group relative isolate inline-flex min-h-13 items-center gap-4 overflow-hidden rounded-[3px] border border-text px-6 font-semibold transition-colors duration-500 ease-out before:absolute before:inset-0 before:-z-10 before:origin-left before:scale-x-0 before:bg-cobalt before:transition-transform before:duration-500 before:ease-out hover:border-cobalt hover:text-white hover:before:scale-x-100 focus-visible:border-cobalt focus-visible:text-white focus-visible:outline-accent focus-visible:before:scale-x-100"
    >
      Read case study<span className="sr-only">: {project.title}</span>
      <Arrow className="group-focus-visible:translate-x-1" />
    </Link>
  );
}
