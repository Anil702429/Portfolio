"use client";

import { usePathname } from "next/navigation";
import { Arrow } from "@/components/ui/arrow";
import { ButtonLink } from "@/components/ui/button";

/** Hidden on the contact page, where it would repeat the form. */
export function FooterCta() {
  if (usePathname() === "/contact") return null;
  return (
    <div className="container-page grid items-end gap-8 pb-16 sm:pb-24 lg:grid-cols-12">
      <p className="display font-display font-semibold text-ink-text lg:col-span-8">Have a project in mind?</p>
      <div className="lg:col-span-4">
        <p className="max-w-md text-lg">Tell me what you&apos;re building: a Django application, a REST API or a backend system.</p>
        <ButtonLink href="/contact" variant="light" className="mt-6">
          Contact me
          <Arrow />
        </ButtonLink>
      </div>
    </div>
  );
}
