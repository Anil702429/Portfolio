import Link from "next/link";
import type { ComponentProps } from "react";

const base =
  "group inline-flex min-h-12 items-center justify-center gap-3 rounded-[3px] border px-6 text-base font-semibold transition-[background-color,border-color,color,transform] duration-300 ease-out active:translate-y-px disabled:opacity-60";

const variants = {
  primary: "border-cobalt bg-cobalt text-white hover:border-cobalt-deep hover:bg-cobalt-deep",
  outline: "border-line text-text hover:border-text",
  onDark: "border-ink-line text-ink-text hover:border-ink-text",
  light: "border-ink-text bg-ink-text text-[#111214] hover:border-white hover:bg-white",
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
