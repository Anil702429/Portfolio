"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";

type Props = {
  action: () => Promise<void>;
  children: React.ReactNode;
  /** When set, the user must confirm first. */
  confirm?: string;
  variant?: "outline" | "danger";
  label?: string;
};

/** Runs a bound Server Action and reports failure next to the button. */
export function ActionButton({ action, children, confirm, variant = "outline", label }: Props) {
  const [pending, startTransition] = useTransition();
  const [failed, setFailed] = useState(false);
  return (
    <span>
      <Button
        type="button"
        variant={variant}
        disabled={pending}
        aria-label={label}
        className="min-h-10 px-3.5 text-sm"
        onClick={() => {
          if (confirm && !window.confirm(confirm)) return;
          setFailed(false);
          startTransition(async () => {
            try {
              await action();
            } catch (error) {
              // Redirects are thrown by Next.js and must keep propagating.
              if (error && typeof error === "object" && "digest" in error && String(error.digest).startsWith("NEXT_")) {
                throw error;
              }
              setFailed(true);
            }
          });
        }}
      >
        {children}
      </Button>
      {failed ? (
        <span role="alert" className="ml-2 text-sm text-danger">
          That didn&apos;t work. Try again.
        </span>
      ) : null}
    </span>
  );
}
