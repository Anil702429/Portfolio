"use client";

import { Button } from "@/components/ui/button";

export default function AdminError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div>
      <h1 className="text-3xl font-bold">This page couldn&apos;t load</h1>
      <p className="mt-3 text-soft">Check that the database is reachable, then try again.</p>
      <Button className="mt-6" onClick={reset}>
        Try again
      </Button>
    </div>
  );
}
