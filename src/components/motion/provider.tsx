"use client";

import { domMax, LazyMotion, MotionConfig } from "motion/react";

export const EASE = [0.16, 1, 0.3, 1] as const;

/** Reduced motion is honoured here and, before hydration, in globals.css. */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domMax} strict>
      <MotionConfig reducedMotion="user" transition={{ duration: 0.7, ease: EASE }}>
        {children}
      </MotionConfig>
    </LazyMotion>
  );
}
