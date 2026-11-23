"use client";

import * as m from "motion/react-m";

type Props = {
  children: React.ReactNode;
  className?: string;
  /** Position among siblings; later items start slightly later. */
  index?: number;
};

// Starts once the element is a little way into the viewport, and runs once.
const viewport = { once: true, margin: "0px 0px -8% 0px" } as const;

export function Reveal({ children, className, index = 0 }: Props) {
  return (
    <m.div
      data-reveal
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewport}
      transition={{ delay: Math.min(index, 4) * 0.07 }}
    >
      {children}
    </m.div>
  );
}

/** Uncovers an image from the bottom edge. */
export function ImageReveal({ children, className, index = 0 }: Props) {
  return (
    <m.div
      data-reveal
      className={className}
      initial={{ clipPath: "inset(0% 0% 30% 0%)", y: 28 }}
      whileInView={{ clipPath: "inset(0% 0% 0% 0%)", y: 0 }}
      viewport={viewport}
      transition={{ duration: 0.9, delay: Math.min(index, 4) * 0.07 }}
    >
      {children}
    </m.div>
  );
}
