"use client";

import { useTheme } from "next-themes";
import { useRef } from "react";

const DURATION = 450;

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const timer = useRef<number | undefined>(undefined);

  function toggle() {
    // Colour transitions exist only while switching, so they never slow other states.
    const root = document.documentElement;
    root.classList.add("theme-switching");
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => root.classList.remove("theme-switching"), DURATION);
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }

  return (
    <button
      type="button"
      aria-label="Switch between light and dark theme"
      className={`relative grid size-11 place-items-center ${className}`}
      onClick={toggle}
    >
      <svg viewBox="0 0 24 24" className="size-5 fill-none stroke-current stroke-[1.75]" aria-hidden="true">
        <g
          strokeLinecap="round"
          className="origin-center scale-50 -rotate-90 opacity-0 transition-[transform,opacity] duration-500 ease-out dark:scale-100 dark:rotate-0 dark:opacity-100"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4m0-14.2-1.4 1.4M6.3 17.7l-1.4 1.4" />
        </g>
        <path
          strokeLinejoin="round"
          d="M20 14.5A8.5 8.5 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5Z"
          className="origin-center transition-[transform,opacity] duration-500 ease-out dark:scale-50 dark:rotate-90 dark:opacity-0"
        />
      </svg>
    </button>
  );
}
