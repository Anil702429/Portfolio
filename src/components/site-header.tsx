import Link from "next/link";
import { SiteNav } from "@/components/site-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { getSettings } from "@/lib/queries";

export async function SiteHeader() {
  const settings = await getSettings();
  return (
    <header className="sticky top-0 z-40 border-b border-ink-line bg-ink text-white">
      <div className="container-page flex min-h-16 items-center gap-6">
        <Link href="/" className="mr-auto text-lg font-bold tracking-tight">
          {settings.name}
        </Link>
        <SiteNav />
        <ThemeToggle className="order-2 -mr-2 md:order-none" />
      </div>
    </header>
  );
}
