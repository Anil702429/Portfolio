import Link from "next/link";
import { SiteNav } from "@/components/site-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { getSettings } from "@/lib/queries";

export async function SiteHeader() {
  const settings = await getSettings();
  return (
    <header className="sticky top-0 z-40 border-b border-ink-line bg-ink text-ink-text">
      <div className="container-page flex min-h-16 items-center gap-8 lg:min-h-18">
        <Link href="/" className="mr-auto font-display text-xl font-semibold tracking-tight">
          {settings.name}
        </Link>
        <SiteNav email={settings.email} />
        <ThemeToggle className="order-2 -mr-2 transition-colors hover:text-ink-accent md:order-none" />
      </div>
    </header>
  );
}
