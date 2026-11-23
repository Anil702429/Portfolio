import Link from "next/link";
import type { ComponentProps } from "react";

const base =
  "inline-flex min-h-11 items-center justify-center rounded-md border px-5 text-base font-semibold transition-colors disabled:opacity-60";

const variants = {
  primary: "border-cobalt bg-cobalt text-white hover:border-cobalt-deep hover:bg-cobalt-deep",
  outline: "border-line text-text hover:bg-tint",
  onDark: "border-ink-line text-white hover:bg-white/10",
  light: "border-white bg-white text-cobalt-deep hover:bg-white/90",
  danger: "border-line text-danger hover:bg-tint",
};

type Variant = keyof typeof variants;

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ComponentProps<"button"> & { variant?: Variant }) {
  return <button className={`${base} ${variants[variant]} ${className}`} {...props} />;
}

export function ButtonLink({
  variant = "primary",
  className = "",
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant }) {
  return <Link className={`${base} ${variants[variant]} ${className}`} {...props} />;
}
