import Link from "next/link";
import { ImageReveal, Reveal } from "@/components/motion/reveal";
import { ProjectCover } from "@/components/project/cover";
import { CaseStudyButton, ExternalLinks } from "@/components/project/links";
import { Tags } from "@/components/ui/tags";
import type { ProjectSummary } from "@/types";

type Props = {
  project: ProjectSummary;
  index: number;
  heading?: "h2" | "h3";
  /** The cover is above the fold: load it first and skip its entrance. */
  priority?: boolean;
};

/** Full-width presentation. Compositions alternate so featured projects differ. */
export function FeaturedCard({ project, index, heading: Heading = "h3", priority = false }: Props) {
  const href = `/projects/${project.slug}`;
  const wide = index % 2 === 0;
  const cover = (
    <Link href={href} tabIndex={-1} aria-hidden="true" className="block">
      <ProjectCover
        project={project}
        mat={index}
        preload={priority}
        caption="Read case study"
        sizes={wide ? "(min-width: 1408px) 1296px, 100vw" : "(min-width: 1024px) 780px, 100vw"}
      />
    </Link>
  );
  const media = priority ? cover : <ImageReveal>{cover}</ImageReveal>;
  const title = (
    <Heading className="display">
      <Link href={href} className="transition-colors duration-300 group-hover/card:text-accent">
        {project.title}
      </Link>
    </Heading>
  );
  const body = (
    <>
      {project.category ? <p className="label text-soft">{project.category}</p> : null}
      <p className="mt-4 max-w-xl text-lg leading-relaxed sm:text-xl">{project.shortDescription}</p>
      <Tags items={project.technologies.map((technology) => technology.name)} className="mt-6 text-soft" />
      <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3">
        <CaseStudyButton project={project} />
        <div className="flex flex-wrap gap-x-7 font-semibold">
          <ExternalLinks project={project} />
        </div>
      </div>
    </>
  );

  if (wide) {
    return (
      <article className="group/card">
        {media}
        <Reveal className="mt-8 grid gap-6 lg:mt-12 lg:grid-cols-12">
          <div className="lg:col-span-7">{title}</div>
          <div className="lg:col-span-5">{body}</div>
        </Reveal>
      </article>
    );
  }
  return (
    <article className="group/card grid items-end gap-8 lg:grid-cols-12 lg:gap-12">
      <Reveal className="order-2 lg:order-1 lg:col-span-5 lg:pb-2" index={1}>
        {title}
        <div className="mt-6">{body}</div>
      </Reveal>
      <div className="order-1 lg:order-2 lg:col-span-7">{media}</div>
    </article>
  );
}
