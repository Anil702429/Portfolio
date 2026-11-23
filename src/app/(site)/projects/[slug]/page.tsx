import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Markdown } from "@/components/markdown";
import { PageHeader } from "@/components/page-header";
import { ProjectCover } from "@/components/project-card";
import { getProject } from "@/lib/queries";
import { decodeSlug } from "@/lib/slug";

export const revalidate = 300;

/** Pages are rendered on first visit, then cached. */
export function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const project = await getProject(decodeSlug((await params).slug));
  if (!project) return { title: "Page not found", robots: { index: false } };
  const canonical = `/projects/${project.slug}`;
  return {
    title: project.title,
    description: project.shortDescription,
    alternates: { canonical },
    openGraph: {
      title: project.title,
      description: project.shortDescription,
      url: canonical,
      images: [project.coverImage ?? "/opengraph-image"],
    },
  };
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="grid gap-5 border-t border-line py-10 lg:grid-cols-[3fr_9fr]">
      <h2 className="text-2xl font-bold">{title}</h2>
      <div className="min-w-0">{children}</div>
    </section>
  );
}

const Paragraphs = ({ text }: { text: string }) => (
  <p className="max-w-2xl text-lg leading-relaxed whitespace-pre-line">{text}</p>
);

export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const project = await getProject(decodeSlug((await params).slug));
  if (!project) notFound();

  const button = "inline-flex min-h-11 items-center rounded-md border px-5 font-semibold";
  return (
    <article>
      <PageHeader title={project.title}>
        <p>{project.shortDescription}</p>
        <div className="mt-7 flex flex-wrap gap-3">
          {project.liveUrl ? (
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className={`${button} border-cobalt bg-cobalt text-white hover:bg-cobalt-deep`}>
              View live site
            </a>
          ) : null}
          {project.githubUrl ? (
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className={`${button} border-ink-line text-white hover:bg-white/10`}>
              View on GitHub
            </a>
          ) : null}
        </div>
      </PageHeader>

      <div className="container-page py-12 sm:py-16">
        {project.coverImage ? (
          <div className="mb-14">
            <ProjectCover project={project} sizes="(min-width: 1152px) 1088px, 100vw" preload />
          </div>
        ) : null}
        <Section title="Overview">
          <Paragraphs text={project.description} />
        </Section>
        {project.problem ? (
          <Section title="Problem">
            <Paragraphs text={project.problem} />
          </Section>
        ) : null}
        {project.solution ? (
          <Section title="Solution">
            <Paragraphs text={project.solution} />
          </Section>
        ) : null}
        {project.features.length ? (
          <Section title="Main features">
            <ul className="max-w-2xl list-disc space-y-2 pl-5 text-lg">
              {project.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </Section>
        ) : null}
        {project.technologies.length ? (
          <Section title="Technology">
            <ul className="flex flex-wrap gap-2">
              {project.technologies.map((technology) => (
                <li key={technology.slug}>
                  <Link
                    href={`/projects?tech=${encodeURIComponent(technology.slug)}`}
                    className="inline-flex min-h-10 items-center rounded-md border border-line px-3.5 text-sm font-medium hover:bg-tint"
                  >
                    {technology.name}
                  </Link>
                </li>
              ))}
            </ul>
          </Section>
        ) : null}
        {project.content ? (
          <Section title="Implementation">
            <Markdown>{project.content}</Markdown>
          </Section>
        ) : null}
        {project.images.length ? (
          <Section title="Screenshots">
            <div className="grid gap-6 md:grid-cols-2">
              {project.images.map((image) => (
                <div key={image.url} className="relative aspect-16/10 overflow-hidden rounded-md border border-line bg-tint">
                  <Image
                    src={image.url}
                    alt={image.alt || `Screenshot of ${project.title}`}
                    fill
                    sizes="(min-width: 768px) 400px, 100vw"
                    className="object-contain"
                  />
                </div>
              ))}
            </div>
          </Section>
        ) : null}
        <Link href="/projects" className="mt-6 inline-block font-semibold text-accent underline underline-offset-4">
          All projects
        </Link>
      </div>
    </article>
  );
}
