import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ApproachList } from "@/components/approach-list";
import { CodePanel } from "@/components/code-panel";
import { ExpertiseList } from "@/components/expertise-list";
import { JsonLd } from "@/components/json-ld";
import { PostCard } from "@/components/post-card";
import { ImageReveal, Reveal } from "@/components/motion/reveal";
import { FeaturedCard } from "@/components/project/featured-card";
import { TechnicalCard } from "@/components/project/technical-card";
import { SchemaDiagram } from "@/components/schema-diagram";
import { TechnicalProfile } from "@/components/technical-profile";
import { Arrow } from "@/components/ui/arrow";
import { ButtonLink } from "@/components/ui/button";
import { headline, philosophy } from "@/content/site-copy";
import { getSiteUrl } from "@/lib/env";
import { getPosts, getProjects, getSettings } from "@/lib/queries";

export const revalidate = 300;
export const metadata: Metadata = { alternates: { canonical: "/" } };

function MoreLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="group inline-flex min-h-11 items-center gap-2 font-semibold transition-colors hover:text-accent">
      <span className="link">{children}</span>
      <Arrow />
    </Link>
  );
}

export default async function HomePage() {
  const [settings, projects, posts] = await Promise.all([getSettings(), getProjects(), getPosts({}, 3)]);
  const featured = projects.filter((project) => project.featured).slice(0, 4);
  const technical = projects.filter((project) => project.highlights.length >= 2).slice(0, 2);
  const profiles = [
    { label: "GitHub", url: settings.githubUrl },
    { label: "LinkedIn", url: settings.linkedinUrl },
  ];

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Person",
          name: settings.name,
          jobTitle: settings.professionalTitle,
          description: settings.introduction,
          url: getSiteUrl(),
          sameAs: [settings.githubUrl, settings.linkedinUrl, ...settings.socialLinks.map((l) => l.url)].filter(Boolean),
        }}
      />

      <section className="overflow-hidden bg-ink text-ink-text">
        <div className="container-page grid items-center gap-x-12 gap-y-16 pt-12 pb-20 lg:min-h-[calc(100svh-4.5rem)] lg:grid-cols-[6fr_6fr] lg:py-16 xl:gap-x-20">
          <div className="min-w-0">
            <p className="enter label flex flex-wrap items-center gap-x-6 gap-y-2 text-ink-soft">
              <span className="text-ink-text">{settings.professionalTitle}</span>
              {settings.availability ? (
                <span className="inline-flex items-center gap-2.5">
                  <span className="relative size-2 shrink-0" aria-hidden="true">
                    <span className="ping absolute inset-0 rounded-full bg-ink-accent" />
                    <span className="absolute inset-0 rounded-full bg-ink-accent" />
                  </span>
                  {settings.availability}
                </span>
              ) : null}
            </p>
            <h1 className="display mt-8">
              {headline.map((line, index) => (
                <span key={line} className="line">
                  <span style={{ animationDelay: `${0.1 + index * 0.09}s` }}>{line} </span>
                </span>
              ))}
            </h1>
            <p className="enter mt-8 max-w-lg text-lg leading-relaxed text-ink-soft [animation-delay:0.42s] sm:text-xl">
              I&apos;m {settings.name}. {settings.introduction}
            </p>
            <div className="enter mt-10 flex flex-wrap gap-3 [animation-delay:0.52s]">
              <ButtonLink href="/projects">
                Explore my work
                <Arrow />
              </ButtonLink>
              <ButtonLink href="/contact" variant="onDark">
                Contact me
              </ButtonLink>
            </div>
            <p className="enter mt-8 flex gap-8 [animation-delay:0.6s]">
              {profiles.map(({ label, url }) =>
                url ? (
                  <a
                    key={label}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex min-h-11 items-center gap-2 text-ink-soft transition-colors hover:text-ink-text"
                  >
                    <span className="link">{label}</span>
                    <Arrow external />
                  </a>
                ) : null,
              )}
            </p>
          </div>
          <SchemaDiagram />
        </div>
      </section>

      {featured.length ? (
        <section className="py-20 sm:py-32">
          <div className="container-page">
            <div className="mb-10 flex flex-wrap items-baseline justify-between gap-4 sm:mb-14">
              <h2 className="title">Selected work</h2>
              <MoreLink href="/projects">All projects</MoreLink>
            </div>
            <div className="space-y-24 sm:space-y-36">
              {featured.map((project, index) => (
                <FeaturedCard key={project.slug} project={project} index={index} />
              ))}
            </div>
            {technical.length ? (
              <div className="mt-24 grid gap-6 sm:mt-36 lg:grid-cols-12">
                {technical.map((project, index) => (
                  <Reveal
                    key={project.slug}
                    index={index}
                    className={technical.length === 1 ? "lg:col-span-12" : index === 0 ? "lg:col-span-7" : "lg:col-span-5"}
                  >
                    <TechnicalCard project={project} heading="h3" />
                  </Reveal>
                ))}
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      <section className="bg-ink py-20 text-ink-text sm:py-32">
        <div className="container-page grid gap-x-16 gap-y-14 lg:grid-cols-12">
          <div className="min-w-0 lg:col-span-7">
            <Reveal>
              <h2 className="title max-w-2xl">Correctness is part of the design</h2>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft">{philosophy}</p>
            </Reveal>
            {settings.heroSnippet ? (
              <Reveal className="mt-12" index={1}>
                <CodePanel code={settings.heroSnippet} label={settings.heroSnippetLabel} url={settings.heroSnippetUrl} />
              </Reveal>
            ) : null}
          </div>
          <div className="lg:col-span-5 lg:pt-2">
            <ApproachList />
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-32">
        <div className="container-page">
          <Reveal>
            <h2 className="title mb-12 sm:mb-16">Expertise</h2>
          </Reveal>
          <ExpertiseList groups={settings.skillGroups} />
        </div>
      </section>

      <section className="bg-tint">
        <div className="grid lg:grid-cols-[5fr_7fr]">
          {settings.profileImage ? (
            <ImageReveal className="relative aspect-4/5 max-h-[36rem] w-full overflow-hidden lg:aspect-auto lg:max-h-none lg:min-h-full">
              <Image
                src={settings.profileImage}
                alt={settings.name}
                fill
                sizes="(min-width: 1024px) 42vw, 100vw"
                className="object-cover object-[50%_25%]"
              />
            </ImageReveal>
          ) : null}
          <div className="px-5 py-20 sm:px-8 sm:py-28 lg:px-14 xl:pr-24 xl:pl-20">
            <h2 className="title">About me</h2>
            <Reveal>
              <p className="mt-8 max-w-2xl font-display text-[clamp(1.35rem,2vw,1.75rem)] leading-snug tracking-tight">
                {settings.about.split(/\n\s*\n/)[0]}
              </p>
            </Reveal>
            <Reveal className="mt-12 max-w-2xl" index={1}>
              <TechnicalProfile settings={settings} />
            </Reveal>
            <div className="mt-8">
              <MoreLink href="/about">More about me</MoreLink>
            </div>
          </div>
        </div>
      </section>

      {posts.length ? (
        <section className="py-20 sm:py-32">
          <div className="container-page">
            <div className="mb-10 flex flex-wrap items-baseline justify-between gap-4">
              <h2 className="title">Latest articles</h2>
              <MoreLink href="/blog">All articles</MoreLink>
            </div>
            {posts.map((post, index) => (
              <Reveal key={post.slug} index={index}>
                <PostCard post={post} heading="h3" />
              </Reveal>
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
}
