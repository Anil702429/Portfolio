import Link from "next/link";
import { FooterCta } from "@/components/footer-cta";
import { getSettings } from "@/lib/queries";

export async function SiteFooter() {
  const settings = await getSettings();
  const external = [
    { label: "GitHub", url: settings.githubUrl },
    { label: "LinkedIn", url: settings.linkedinUrl },
    ...settings.socialLinks,
    { label: "Resume", url: settings.resumeUrl },
  ].filter((link): link is { label: string; url: string } => Boolean(link.url));
  const item = "inline-block py-1 transition-colors hover:text-ink-text";

  return (
    <footer className="bg-ink pt-20 pb-10 text-ink-soft sm:pt-32">
      <FooterCta />
      <div className="container-page">
        <div className="grid gap-x-8 gap-y-10 border-t border-ink-line pt-10 sm:grid-cols-2 lg:grid-cols-12">
          <div className="sm:col-span-2 lg:col-span-6">
            {settings.email ? (
              <a
                href={`mailto:${settings.email}`}
                className="link font-display text-[clamp(1.35rem,3vw,2.25rem)] font-semibold tracking-tight text-ink-text"
              >
                {settings.email}
              </a>
            ) : null}
            <p className="mt-5">{settings.professionalTitle}</p>
          </div>
          <nav aria-label="Footer" className="lg:col-span-3">
            <ul>
              {["Projects", "About", "Blog", "Contact"].map((label) => (
                <li key={label}>
                  <Link href={`/${label.toLowerCase()}`} className={item}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <ul className="lg:col-span-3">
            {external.map(({ label, url }) => (
              <li key={label}>
                <a href={url} target="_blank" rel="noopener noreferrer" className={item}>
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="label mt-16 flex flex-wrap justify-between gap-4">
          <p>
            © {new Date().getUTCFullYear()} {settings.name}
          </p>
          <a href="#main" className="hover:text-ink-text">
            Back to top
          </a>
        </div>
      </div>
    </footer>
  );
}
