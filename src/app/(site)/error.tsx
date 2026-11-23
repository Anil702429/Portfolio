"use client";

import { Button } from "@/components/ui/button";

export default function SiteError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="container-page py-24">
      <h1 className="text-4xl font-bold">This page couldn&apos;t load</h1>
      <p className="mt-4 text-soft">The content could not be reached. Wait a moment, then try again.</p>
      <Button className="mt-8" onClick={reset}>
        Try again
      </Button>
    </div>
  );
}
