"use client";

import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";
import { statement } from "@/lib/content";
import { Monogram } from "../logo";

function Word({ word, progress, range, accent }: { word: string; progress: MotionValue<number>; range: [number, number]; accent?: boolean }) {
  const opacity = useTransform(progress, range, [0.16, 1]);
  return (
    <motion.span style={{ opacity }} className={`scroll-word ${accent ? "text-oxide-bright" : ""}`}>
      {word}{" "}
    </motion.span>
  );
}

/** Full-bleed statement whose words light up as it scrolls through the viewport. */
export function Statement() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });
  const lead = statement.lead.split(" ");
  const emphasis = statement.emphasis.split(" ");
  const total = lead.length + emphasis.length;
  const words = [...lead.map((w) => ({ w, accent: false })), ...emphasis.map((w) => ({ w, accent: true }))];

  return (
    <section aria-label="Our promise" className="on-ink relative overflow-hidden bg-ink text-paper">
      <div className="grid-paper pointer-events-none absolute inset-0 opacity-70" />
      <Monogram className="pointer-events-none absolute -right-16 top-1/2 h-[28rem] w-[28rem] -translate-y-1/2 text-paper/[0.035]" />
      <div ref={ref} className="container-x relative py-28 lg:py-44">
        <p className="label mb-10 flex items-center gap-3 text-muted-on-ink">
          <span className="text-oxide-bright">A-02</span>
          <span className="h-px w-8 bg-line-on-ink" aria-hidden="true" />
          <span>How every project runs</span>
        </p>
        <p className="font-display max-w-[20ch] text-[clamp(2.2rem,6vw,5.4rem)] font-medium leading-[1.02]">
          {words.map(({ w, accent }, i) => (
            <Word
              key={i}
              word={w}
              accent={accent}
              progress={scrollYProgress}
              range={[i / total, (i + 1) / total]}
            />
          ))}
        </p>
      </div>
    </section>
  );
}
