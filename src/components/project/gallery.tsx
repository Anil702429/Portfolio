"use client";

import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { useState, type MouseEvent } from "react";
import { FeaturedCard } from "@/components/project/featured-card";
import { StandardCard } from "@/components/project/standard-card";
import { TechnicalCard } from "@/components/project/technical-card";
import type { ProjectSummary } from "@/types";

type Technology = { name: string; slug: string };

/** Row pattern for everything after the lead project: 7/5, then 5/7. */
const SPANS = ["lg:col-span-7", "lg:col-span-5", "lg:col-span-5", "lg:col-span-7"];

export function ProjectGallery({
  projects,
  technologies,
  initial,
}: {
  projects: ProjectSummary[];
  technologies: Technology[];
  initial: string | null;
}) {
  const [active, setActive] = useState(initial);

  function choose(event: MouseEvent<HTMLAnchorElement>, slug: string | null) {
    // Leave "open in a new tab" and similar to the browser.
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    setActive(slug);
    window.history.replaceState(null, "", slug ? `/projects?tech=${encodeURIComponent(slug)}` : "/projects");
  }

  // Roles come from the full list, so filtering never changes a card's design.
  const lead = projects.find((project) => project.featured) ?? projects[0];
  const tiles: { kind: "standard" | "technical"; project: ProjectSummary }[] = projects
    .filter((project) => project !== lead)
    .map((project) => ({ kind: "standard", project }));
  // The lead project's engineering sits beside the first standard card.
  if (lead && lead.highlights.length >= 2) tiles.splice(1, 0, { kind: "technical", project: lead });
  const matches = (project: ProjectSummary) => !active || project.technologies.some((t) => t.slug === active);
  const visibleTiles = tiles.filter((tile) => matches(tile.project));
  const count = projects.filter(matches).length;
  const name = technologies.find((technology) => technology.slug === active)?.name;

  const filter = (slug: string | null, label: string) => {
    const selected = active === slug;
    return (
      <a
        key={label}
        href={slug ? `/projects?tech=${encodeURIComponent(slug)}` : "/projects"}
        onClick={(event) => choose(event, slug)}
        aria-current={selected ? "true" : undefined}
        className={`label relative inline-flex min-h-11 items-center transition-colors duration-300 ${selected ? "text-text" : "text-soft hover:text-text"}`}
      >
        {label}
        {selected ? (
          <m.span
            layoutId="filter-underline"
            layoutDependency={active}
            className="absolute inset-x-0 -bottom-px h-0.5 bg-accent"
            transition={{ duration: 0.45 }}
          />
        ) : null}
      </a>
    );
  };

  const motionProps = {
    layout: "position" as const,
    layoutDependency: active,
    exit: { opacity: 0, scale: 0.985, transition: { duration: 0.2 } },
    transition: { duration: 0.55 },
  };

  return (
    <>
      {technologies.length ? (
        <nav
          aria-label="Filter by technology"
          className="mb-12 flex flex-wrap gap-x-7 border-b border-line sm:mb-16"
        >
          {filter(null, "All")}
          {technologies.map((technology) => filter(technology.slug, technology.name))}
        </nav>
      ) : null}
      <p className="sr-only" aria-live="polite">
        {active ? `${count} ${count === 1 ? "project uses" : "projects use"} ${name ?? active}` : ""}
      </p>
      <div className="grid gap-x-12 gap-y-24 sm:gap-y-32 lg:grid-cols-12">
        <AnimatePresence mode="popLayout" initial={false}>
          {lead && matches(lead) ? (
            <m.div
              key="lead"
              {...motionProps}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-12"
            >
              <FeaturedCard project={lead} index={0} heading="h2" priority />
            </m.div>
          ) : null}
          {visibleTiles.map(({ kind, project }, index) => (
            <m.div
              key={`${kind}-${project.slug}`}
              {...motionProps}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className={
                // A card alone on its row takes the wider span.
                index === visibleTiles.length - 1 && index % 2 === 0 ? "lg:col-span-7" : SPANS[index % SPANS.length]
              }
            >
              {kind === "standard" ? (
                <StandardCard project={project} mat={index + 1} />
              ) : (
                <TechnicalCard project={project} />
              )}
            </m.div>
          ))}
        </AnimatePresence>
      </div>
      {count === 0 ? <p className="text-lg text-soft">No projects use {name ?? "this technology"}.</p> : null}
    </>
  );
}
