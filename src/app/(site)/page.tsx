import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CodePanel } from "@/components/code-panel";
import { PostCard } from "@/components/post-card";
import { FeaturedProject } from "@/components/project-card";
import { ButtonLink } from "@/components/ui/button";
import { JsonLd } from "@/components/json-ld";
import { getSiteUrl } from "@/lib/env";
import { getPosts, getProjects, getSettings } from "@/lib/queries";

export const revalidate = 300;
export const metadata: Metadata = { alternates: { canonical: "/" } };

const approach = [
  { title: "Understand the problem", text: "Start with what people need to do and the rules the data has to follow." },
  { title: "Design the solution", text: "Settle the data model, the boundaries between parts, and how they talk to each other." },
  { title: "Build it", text: "Write clear code in focused pieces, with validation and permissions on the server." },
  { title: "Test it", text: "Check the real workflow, including the paths where something goes wrong." },
  { title: "Improve it", text: "Use what was learned to simplify the code and make the product better." },
];

export default async function HomePage() {
  const [settings, projects, posts] = await Promise.all([getSettings(), getProjects(), getPosts({}, 3)]);
  const featured = projects.filter((project) => project.featured).slice(0, 4);
  const profiles = [
    { label: "GitHub", url: settings.githubUrl },
    { label: "LinkedIn", url: settings.linkedinUrl },
  ];
  const textLink = "font-semibold text-accent underline underline-offset-4 hover:text-accent-strong";

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

      <section className="bg-ink text-white">
        <div className="container-page grid items-center gap-12 py-16 sm:py-24 lg:grid-cols-[5fr_6fr] lg:gap-12">
          <div className="min-w-0">
            <h1>
              <span className="block text-5xl font-extrabold sm:text-7xl">{settings.name}</span>{" "}
              <span className="mt-4 block text-xl font-semibold tracking-normal text-ink-accent sm:text-2xl">
                {settings.professionalTitle}
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft">{settings.introduction}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/projects">View projects</ButtonLink>
              <ButtonLink href="/contact" variant="onDark">
                Contact me
              </ButtonLink>
            </div>
            <p className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-ink-soft">
              {profiles.map(({ label, url }) =>
                url ? (
                  <a key={label} href={url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-white">
                    {label}
                  </a>
                ) : null,
              )}
              {settings.availability ? <span>{settings.availability}</span> : null}
            </p>
          </div>
          {settings.heroSnippet ? (
            <CodePanel code={settings.heroSnippet} label={settings.heroSnippetLabel} url={settings.heroSnippetUrl} />
          ) : null}
        </div>
      </section>

      {settings.skillGroups.length ? (
        <section className="py-16 sm:py-24">
          <div className="container-page">
            <h2 className="text-3xl font-bold sm:text-4xl">What I work with</h2>
            <dl className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
              {settings.skillGroups.map((group) => (
                <div key={group.name} className="border-t-2 border-text pt-4">
                  <dt className="text-lg font-bold">{group.name}</dt>
                  {group.skills.map((skill) => (
                    <dd key={skill} className="mt-2 text-soft">
                      {skill}
                    </dd>
                  ))}
                </div>
              ))}
            </dl>
          </div>
        </section>
      ) : null}

      {featured.length ? (
        <section className="bg-tint py-16 sm:py-24">
          <div className="container-page">
            <div className="flex flex-wrap items-baseline justify-between gap-4">
              <h2 className="text-3xl font-bold sm:text-4xl">Featured projects</h2>
              <Link href="/projects" className={textLink}>
                All projects
              </Link>
            </div>
            <div className="mt-12 space-y-16 sm:space-y-20">
              {featured.map((project) => (
                <FeaturedProject key={project.slug} project={project} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="py-16 sm:py-24">
        <div className="container-page grid gap-10 lg:grid-cols-[4fr_8fr]">
          <h2 className="text-3xl font-bold sm:text-4xl">How I approach development</h2>
          <ol>
            {approach.map((step, index) => (
              <li key={step.title} className="grid gap-x-8 gap-y-1 border-t border-line py-5 sm:grid-cols-[2rem_13rem_1fr]">
                <span className="font-mono text-accent" aria-hidden="true">
                  {index + 1}
                </span>
                <h3 className="text-lg font-bold">{step.title}</h3>
                <p className="text-soft">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-tint py-16 sm:py-24">
        <div className="container-page grid items-center gap-10 md:grid-cols-[4fr_8fr] md:gap-16">
          {settings.profileImage ? (
            <Image
              src={settings.profileImage}
              alt={settings.name}
              width={720}
              height={960}
              sizes="(min-width: 768px) 340px, 100vw"
              className="aspect-4/5 w-full max-w-sm rounded-md object-cover object-top"
            />
          ) : null}
          <div>
            <h2 className="text-3xl font-bold sm:text-4xl">About me</h2>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-soft">{settings.about.split(/\n\s*\n/)[0]}</p>
            <Link href="/about" className={`mt-6 inline-block ${textLink}`}>
              More about me
            </Link>
          </div>
        </div>
      </section>

      {posts.length ? (
        <section className="py-16 sm:py-24">
          <div className="container-page">
            <div className="mb-10 flex flex-wrap items-baseline justify-between gap-4">
              <h2 className="text-3xl font-bold sm:text-4xl">Latest articles</h2>
              <Link href="/blog" className={textLink}>
                All articles
              </Link>
            </div>
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} heading="h3" />
            ))}
          </div>
        </section>
      ) : null}

      <section className="bg-cobalt py-16 text-white sm:py-20">
        <div className="container-page flex flex-wrap items-center justify-between gap-8">
          <div>
            <h2 className="text-3xl font-bold sm:text-4xl">Have a project in mind?</h2>
            <p className="mt-3 max-w-xl text-lg">
              Tell me what you&apos;re building: a Django application, a REST API or a backend system.
            </p>
          </div>
          <ButtonLink href="/contact" variant="light">
            Contact me
          </ButtonLink>
        </div>
      </section>
    </>
  );
}
