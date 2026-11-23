"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const links = [
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export function SiteNav() {
  const pathname = usePathname();
  // Remembering the page the menu was opened on closes it after navigation.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpenOn(null);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        className="order-3 -mr-2 grid size-11 place-items-center md:hidden"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="site-nav"
        onClick={() => setOpenOn(open ? null : pathname)}
      >
        <svg viewBox="0 0 24 24" className="size-6 stroke-current stroke-2" aria-hidden="true">
          <path d={open ? "M5 5l14 14M19 5L5 19" : "M3 8h18M3 16h18"} strokeLinecap="round" />
        </svg>
      </button>
      <nav
        id="site-nav"
        aria-label="Main"
        className={`${open ? "flex" : "hidden"} fixed inset-x-0 top-16 bottom-0 flex-col gap-2 bg-ink px-5 py-6 text-2xl font-semibold md:static md:flex md:flex-row md:gap-7 md:p-0 md:text-base md:font-medium`}
      >
        {links.map(({ href, label }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              onClick={() => setOpenOn(null)}
              className={`py-2 hover:text-white ${active ? "text-white underline decoration-ink-accent decoration-2 underline-offset-8" : "text-ink-soft"}`}
            >
              {label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
