"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/posts", label: "Articles" },
  { href: "/admin/messages", label: "Messages" },
  { href: "/admin/settings", label: "Settings" },
];

export function AdminNav({ unread }: { unread: number }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Admin" className="-mx-2 flex flex-wrap gap-1 lg:flex-col">
      {links.map(({ href, label }) => {
        const active = href === "/admin" ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`flex min-h-10 items-center rounded-md px-2.5 font-medium ${active ? "bg-cobalt text-white" : "text-ink-soft hover:text-white"}`}
          >
            {label}
            {label === "Messages" && unread ? <span className="ml-1.5">({unread} unread)</span> : null}
          </Link>
        );
      })}
    </nav>
  );
}
