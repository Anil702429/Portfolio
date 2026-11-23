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

export function SiteNav({ email }: { email: string | null }) {
  const pathname = usePathname();
  // Remembering the page the menu was opened on closes it after navigation.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpenOn(null);
    // A menu left open while the window grows must not keep the page locked.
    const desktop = window.matchMedia("(min-width: 48rem)");
    const onResize = () => desktop.matches && setOpenOn(null);
    window.addEventListener("keydown", onKey);
    desktop.addEventListener("change", onResize);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      desktop.removeEventListener("change", onResize);
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
        <svg viewBox="0 0 24 24" className="size-6 stroke-current stroke-[1.5]" aria-hidden="true">
          <path d="M3 8.5h18" className={`origin-center transition-transform duration-300 ease-out ${open ? "translate-y-[3.5px] rotate-45" : ""}`} />
          <path d="M3 15.5h18" className={`origin-center transition-transform duration-300 ease-out ${open ? "-translate-y-[3.5px] -rotate-45" : ""}`} />
        </svg>
      </button>
      <nav
        id="site-nav"
        aria-label="Main"
        className={`${open ? "flex" : "hidden"} fixed inset-x-0 top-[65px] bottom-0 flex-col overflow-y-auto bg-ink px-5 pt-6 pb-8 sm:px-8 md:static md:flex md:flex-row md:gap-9 md:overflow-visible md:p-0`}
      >
        {links.map(({ href, label }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              onClick={() => setOpenOn(null)}
              className={`border-b border-ink-line py-4 font-display text-4xl font-semibold tracking-tight md:nav-link md:border-0 md:py-2 md:font-sans md:text-base md:font-medium md:tracking-normal ${
                active ? "text-ink-accent md:text-ink-text" : "text-ink-text md:text-ink-soft md:hover:text-ink-text"
              }`}
            >
              {label}
            </Link>
          );
        })}
        {email ? (
          <a href={`mailto:${email}`} className="mt-auto pt-10 text-lg text-ink-soft md:hidden">
            {email}
          </a>
        ) : null}
      </nav>
    </>
  );
}
