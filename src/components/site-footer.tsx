import Link from "next/link";
import { getSettings } from "@/lib/queries";

export async function SiteFooter() {
  const settings = await getSettings();
  const external = [
    { label: "GitHub", url: settings.githubUrl },
    { label: "LinkedIn", url: settings.linkedinUrl },
    ...settings.socialLinks,
    { label: "Resume", url: settings.resumeUrl },
  ].filter((link): link is { label: string; url: string } => Boolean(link.url));

  return (
    <footer className="bg-ink py-14 text-ink-soft">
      <div className="container-page grid gap-10 md:grid-cols-[2fr_1fr_1fr]">
        <div>
          <p className="text-xl font-bold text-white">{settings.name}</p>
          <p className="mt-2">{settings.professionalTitle}</p>
          {settings.email ? (
            <a href={`mailto:${settings.email}`} className="mt-4 inline-block underline underline-offset-4 hover:text-white">
              {settings.email}
            </a>
          ) : null}
        </div>
        <nav aria-label="Footer">
          <ul className="space-y-2">
            {["Projects", "About", "Blog", "Contact"].map((label) => (
              <li key={label}>
                <Link href={`/${label.toLowerCase()}`} className="hover:text-white">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <ul className="space-y-2">
          {external.map(({ label, url }) => (
            <li key={label}>
              <a href={url} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                {label}
              </a>
            </li>
          ))}
        </ul>
        <p className="border-t border-ink-line pt-6 text-sm md:col-span-3">
          © {new Date().getUTCFullYear()} {settings.name}
        </p>
      </div>
    </footer>
  );
}
