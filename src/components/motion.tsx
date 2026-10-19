"use client";

import { MotionConfig, motion, type HTMLMotionProps } from "motion/react";
import type { ReactNode } from "react";

export const EASE = [0.16, 1, 0.3, 1] as const;

export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user" transition={{ ease: EASE, duration: 0.8 }}>
      {children}
    </MotionConfig>
  );
}

type RevealProps = HTMLMotionProps<"div"> & { delay?: number; y?: number };

/** Fades content up once as it enters the viewport. */
export function Reveal({ delay = 0, y = 22, children, ...rest }: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.9, ease: EASE, delay }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
