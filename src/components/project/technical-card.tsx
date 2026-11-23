import Link from "next/link";
import { ExternalLinks } from "@/components/project/links";
import { Arrow } from "@/components/ui/arrow";
import type { ProjectSummary } from "@/types";

const LAYERS: [string, string[]][] = [
  ["Interface", ["html", "css", "javascript", "typescript", "tailwind-css", "bootstrap", "react"]],
  ["Application", ["python", "django", "django-rest-framework", "flask", "fastapi", "rest-apis"]],
  ["Data and services", ["postgresql", "mysql", "sqlite", "redis", "cloudinary", "docker"]],
];

/** Where each listed technology sits. Built only from the project's own list. */
function layersOf(project: ProjectSummary) {
  return LAYERS.map(([name, slugs]) => ({
    name,
    items: project.technologies.filter((technology) => slugs.includes(technology.slug)).map((t) => t.name),
  })).filter((layer) => layer.items.length > 0);
}

/**
 * How a project is built: its stack by layer, and the sections of its
 * implementation notes. Both come from the project record in the admin.
 */
export function TechnicalCard({
  project,
  heading: Heading = "h2",
}: {
  project: ProjectSummary;
  heading?: "h2" | "h3";
}) {
  const href = `/projects/${project.slug}`;
  const layers = layersOf(project);
  return (
    <article className="group/card flex h-full flex-col rounded-[3px] border border-ink-line bg-[#111214] p-6 text-[#f3f1ea] transition-colors duration-500 focus-within:border-ink-accent hover:border-ink-accent sm:p-9 dark:bg-[#0e0f10]">
      <Heading className="text-3xl sm:text-4xl">
        <Link href={href} className="transition-colors duration-300 group-hover/card:text-ink-accent">
          Inside {project.title}
        </Link>
      </Heading>

      {layers.length ? (
        <ol className="mt-8" aria-label="Stack by layer">
          {layers.map((layer, index) => (
            <li key={layer.name} className="relative pb-3 last:pb-0">
              {index < layers.length - 1 ? (
                <span aria-hidden="true" className="absolute bottom-0 left-6 h-3 w-px bg-[#6c6f76]">
                  <span className="flow block h-1.5 w-px bg-ink-accent" style={{ animationDelay: `${index * 0.6}s` }} />
                </span>
              ) : null}
              <div className="label grid gap-x-4 rounded-[3px] border border-[#3d4047] bg-[#191a1d] px-4 py-3 transition-colors duration-500 group-hover/card:border-[#565a63] sm:grid-cols-[9.5rem_1fr]">
                <span className="text-ink-soft">{layer.name}</span>
                <span>{layer.items.join(", ")}</span>
              </div>
            </li>
          ))}
        </ol>
      ) : null}

      <dl className="mt-9">
        {project.highlights.slice(0, 4).map((highlight) => (
          <div key={highlight.title} className="border-t border-ink-line py-4">
            <dt className="font-semibold">{highlight.title}</dt>
            <dd className="mt-1 text-ink-soft">{highlight.text}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-auto flex flex-wrap gap-x-7 pt-4 font-semibold [--accent:var(--color-ink-accent)]">
        <Link
          href={`${href}#implementation`}
          className="group inline-flex min-h-11 items-center gap-2 transition-colors duration-300 hover:text-ink-accent"
        >
          <span className="link">
            Read the implementation notes<span className="sr-only">: {project.title}</span>
          </span>
          <Arrow />
        </Link>
        <ExternalLinks project={{ ...project, liveUrl: null }} />
      </div>
    </article>
  );
}
