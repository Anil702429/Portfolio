import type { Metadata } from "next";
import Image from "next/image";
import { Markdown } from "@/components/markdown";
import { PageHeader } from "@/components/page-header";
import { ButtonLink } from "@/components/ui/button";
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
  return (
    <>
      <PageHeader title={`About ${settings.name}`}>
        <p>{settings.introduction}</p>
      </PageHeader>

      <div className="container-page grid gap-12 py-14 sm:py-20 md:grid-cols-[8fr_4fr] md:gap-16">
        <div>
          <Markdown>{settings.about}</Markdown>
          <div className="mt-10 flex flex-wrap gap-3">
            <ButtonLink href="/contact">Contact me</ButtonLink>
            {settings.resumeUrl ? (
              <ButtonLink href={settings.resumeUrl} target="_blank" rel="noopener noreferrer" variant="outline">
                View resume
              </ButtonLink>
            ) : null}
          </div>
        </div>
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
      </div>

      <section className="bg-tint py-14 sm:py-20">
        <div className="container-page grid gap-8 lg:grid-cols-[4fr_8fr]">
          <h2 className="text-3xl font-bold">Development philosophy</h2>
          <div className="max-w-2xl space-y-4 text-lg leading-relaxed text-soft">
            <p>
              I work from the problem to the product: understand what is needed, design the solution, build it, test
              it, and improve it.
            </p>
            <p>
              I put the emphasis on clean architecture, clear code and continuous improvement. Every project is an
              opportunity to learn something new and build something better.
            </p>
          </div>
        </div>
      </section>

      {settings.skillGroups.length ? (
        <section className="py-14 sm:py-20">
          <div className="container-page grid gap-8 lg:grid-cols-[4fr_8fr]">
            <h2 className="text-3xl font-bold">Skills and tools</h2>
            <dl>
              {settings.skillGroups.map((group) => (
                <div key={group.name} className="grid gap-1 border-t border-line py-5 sm:grid-cols-[14rem_1fr]">
                  <dt className="text-lg font-bold">{group.name}</dt>
                  <dd className="text-lg text-soft">{group.skills.join(", ")}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      ) : null}

      {settings.education.length ? (
        <section className="bg-tint py-14 sm:py-20">
          <div className="container-page grid gap-8 lg:grid-cols-[4fr_8fr]">
            <h2 className="text-3xl font-bold">Education</h2>
            <ul className="space-y-6">
              {settings.education.map((item) => (
                <li key={`${item.title}${item.institution}${item.period}`}>
                  <p className="text-lg font-bold">{item.title}</p>
                  {item.institution ? <p className="text-soft">{item.institution}</p> : null}
                  {item.period ? <p className="text-soft">{item.period}</p> : null}
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}
    </>
  );
}
