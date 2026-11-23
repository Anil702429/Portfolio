import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { PageHeader } from "@/components/page-header";
import { getSettings } from "@/lib/queries";

export const revalidate = 300;
export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch about a project, an opportunity or a question.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage() {
  const settings = await getSettings();
  const links = [
    { label: "GitHub", url: settings.githubUrl },
    { label: "LinkedIn", url: settings.linkedinUrl },
  ];
  return (
    <>
      <PageHeader title="Contact">
        <p>Write to me about a project, an opportunity or a question.</p>
      </PageHeader>
      <div className="container-page grid gap-14 py-16 sm:py-28 lg:grid-cols-[7fr_5fr] lg:gap-28">
        <ContactForm />
        <div className="space-y-9">
          {settings.email ? (
            <div>
              <h2 className="label font-sans font-normal tracking-normal text-soft">Email</h2>
              <a href={`mailto:${settings.email}`} className="link mt-1 inline-block text-xl break-all transition-colors hover:text-accent">
                {settings.email}
              </a>
            </div>
          ) : null}
          {links.some((link) => link.url) ? (
            <div>
              <h2 className="label font-sans font-normal tracking-normal text-soft">Profiles</h2>
              <ul className="mt-2 space-y-3">
                {links.map(({ label, url }) =>
                  url ? (
                    <li key={label}>
                      <a href={url} target="_blank" rel="noopener noreferrer" className="link text-xl transition-colors hover:text-accent">
                        {label}
                      </a>
                    </li>
                  ) : null,
                )}
              </ul>
            </div>
          ) : null}
          {settings.location ? (
            <div>
              <h2 className="label font-sans font-normal tracking-normal text-soft">Location</h2>
              <p className="mt-1 text-xl">{settings.location}</p>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}
