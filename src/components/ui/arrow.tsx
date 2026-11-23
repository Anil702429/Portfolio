/** Drawn arrow. Moves when its parent carries the "group" class. */
export function Arrow({ external = false, className = "" }: { external?: boolean; className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden="true"
      className={`size-4 shrink-0 fill-none stroke-current stroke-[1.5] transition-transform duration-500 ease-out ${
        external ? "group-hover:translate-x-0.5 group-hover:-translate-y-0.5" : "group-hover:translate-x-1"
      } ${className}`}
    >
      <path d={external ? "M4 12 12 4M5.5 4H12v6.5" : "M2 8h12M9.5 3.5 14 8l-4.5 4.5"} />
    </svg>
  );
}
