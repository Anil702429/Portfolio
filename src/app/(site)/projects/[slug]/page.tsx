import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Markdown } from "@/components/markdown";
import { PageHeader } from "@/components/page-header";
import { ProjectCover } from "@/components/project/cover";
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

function Section({ title, id, children }: { title: string; id?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="grid gap-x-12 gap-y-6 border-t border-line py-12 sm:py-16 lg:grid-cols-12">
      <h2 className="text-3xl sm:text-4xl lg:col-span-4">{title}</h2>
      <div className="min-w-0 lg:col-span-8">{children}</div>
    </section>
  );
}

const Paragraphs = ({ text }: { text: string }) => (
  <p className="max-w-2xl text-lg leading-relaxed whitespace-pre-line sm:text-xl">{text}</p>
);

export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const project = await getProject(decodeSlug((await params).slug));
  if (!project) notFound();

  const button = "inline-flex min-h-11 items-center rounded-[3px] border px-5 font-semibold transition-colors duration-300";
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
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className={`${button} border-ink-line text-ink-text hover:border-ink-text`}>
              View on GitHub
            </a>
          ) : null}
        </div>
      </PageHeader>

      <div className="container-page py-10 sm:py-16">
        {project.coverImage ? (
          <div className="mb-14">
            <ProjectCover project={project} sizes="(min-width: 1408px) 1296px, 100vw" preload />
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
            <ul className="max-w-2xl border-b border-line text-lg">
              {project.features.map((feature) => (
                <li key={feature} className="border-t border-line py-4">
                  {feature}
                </li>
              ))}
            </ul>
          </Section>
        ) : null}
        {project.technologies.length ? (
          <Section title="Technology">
            <ul className="flex flex-wrap gap-x-7">
              {project.technologies.map((technology) => (
                <li key={technology.slug}>
                  <Link
                    href={`/projects?tech=${encodeURIComponent(technology.slug)}`}
                    className="label inline-flex min-h-11 items-center text-accent hover:text-accent-strong"
                  >
                    {technology.name}
                  </Link>
                </li>
              ))}
            </ul>
          </Section>
        ) : null}
        {project.content ? (
          <Section title="Implementation" id="implementation">
            <Markdown>{project.content}</Markdown>
          </Section>
        ) : null}
        {project.images.length ? (
          <Section title="Screenshots">
            <div className="grid gap-6 md:grid-cols-2">
              {project.images.map((image) => (
                <div key={image.url} className="relative aspect-16/10 overflow-hidden rounded-[3px] border border-line bg-tint">
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
        <Link href="/projects" className="link mt-6 inline-block font-semibold hover:text-accent">
          All projects
        </Link>
      </div>
    </article>
  );
}
