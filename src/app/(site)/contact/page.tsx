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
      <div className="container-page grid gap-14 py-14 sm:py-20 md:grid-cols-[8fr_4fr] md:gap-20">
        <ContactForm />
        <div className="space-y-6">
          {settings.email ? (
            <div>
              <h2 className="font-bold">Email</h2>
              <a href={`mailto:${settings.email}`} className="mt-1 inline-block text-accent underline underline-offset-4">
                {settings.email}
              </a>
            </div>
          ) : null}
          {links.some((link) => link.url) ? (
            <div>
              <h2 className="font-bold">Profiles</h2>
              <ul className="mt-1 space-y-1">
                {links.map(({ label, url }) =>
                  url ? (
                    <li key={label}>
                      <a href={url} target="_blank" rel="noopener noreferrer" className="text-accent underline underline-offset-4">
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
              <h2 className="font-bold">Location</h2>
              <p className="mt-1 text-soft">{settings.location}</p>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}
