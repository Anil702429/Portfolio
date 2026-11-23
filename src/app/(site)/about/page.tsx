import type { Metadata } from "next";
import Image from "next/image";
import { ApproachList } from "@/components/approach-list";
import { Markdown } from "@/components/markdown";
import { Reveal } from "@/components/motion/reveal";
import { PageHeader } from "@/components/page-header";
import { TechnicalProfile } from "@/components/technical-profile";
import { Arrow } from "@/components/ui/arrow";
import { ButtonLink } from "@/components/ui/button";
import { Tags } from "@/components/ui/tags";
import { philosophy } from "@/content/site-copy";
import { getSettings } from "@/lib/queries";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    title: "About",
    description: `About ${settings.name}, ${settings.professionalTitle}.`,
    alternates: { canonical: "/about" },
  };
}

export default async function AboutPage() {
  const settings = await getSettings();
  const [lead = "", ...rest] = settings.about.split(/\n\s*\n/);
  return (
    <>
      <PageHeader title={`About ${settings.name}`} />

      <section className="py-16 sm:py-28">
        <div className="container-page grid gap-x-16 gap-y-12 lg:grid-cols-12">
          {settings.profileImage ? (
            <div className="lg:col-span-5 lg:-mt-40">
              <Image
                src={settings.profileImage}
                alt={settings.name}
                width={720}
                height={960}
                sizes="(min-width: 1024px) 520px, 100vw"
                preload
                className="aspect-4/5 w-full max-w-md rounded-[3px] object-cover object-top lg:max-w-none"
              />
            </div>
          ) : null}
          <div className="min-w-0 lg:col-span-7">
            <p className="font-display text-[clamp(1.5rem,2.6vw,2.35rem)] leading-[1.25] tracking-tight">{lead}</p>
            {rest.length ? (
              <div className="mt-10">
                <Markdown>{rest.join("\n\n")}</Markdown>
              </div>
            ) : null}
            <div className="mt-10 flex flex-wrap gap-3">
              <ButtonLink href="/contact">
                Contact me
                <Arrow />
              </ButtonLink>
              {settings.resumeUrl ? (
                <ButtonLink href={settings.resumeUrl} target="_blank" rel="noopener noreferrer" variant="outline">
                  View resume
                  <Arrow external />
                </ButtonLink>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-ink py-20 text-ink-text sm:py-28">
        <div className="container-page grid gap-x-16 gap-y-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-6">
            <h2 className="title">Development philosophy</h2>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft">{philosophy}</p>
          </Reveal>
          <div className="lg:col-span-6">
            <ApproachList />
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-28">
        <div className="container-page grid gap-x-16 gap-y-16 lg:grid-cols-2">
          <Reveal>
            <h2 className="title mb-10">Technical profile</h2>
            <TechnicalProfile settings={settings} />
          </Reveal>
          {settings.skillGroups.length ? (
            <Reveal index={1}>
              <h2 className="title mb-10">Skills and tools</h2>
              <dl className="border-b border-line">
                {settings.skillGroups.map((group) => (
                  <div key={group.name} className="border-t border-line py-4">
                    <dt className="font-semibold">{group.name}</dt>
                    <dd className="mt-2">
                      <Tags items={group.skills} className="text-soft" />
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          ) : null}
        </div>
      </section>
    </>
  );
}
