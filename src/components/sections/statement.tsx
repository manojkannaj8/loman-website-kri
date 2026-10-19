"use client";

import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";
import { statement } from "@/lib/content";

function Word({ word, progress, range, accent }: { word: string; progress: MotionValue<number>; range: [number, number]; accent?: boolean }) {
  const opacity = useTransform(progress, range, [0.16, 1]);
  return (
    <motion.span style={{ opacity }} className={`scroll-word ${accent ? "italic font-normal text-glow" : ""}`}>
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
    <section aria-label="Our promise" className="on-ink dusk-light relative overflow-hidden text-paper">
      <div ref={ref} className="container-x relative py-28 lg:py-44">
        <p className="label mb-10 flex items-center gap-3 text-muted-on-ink">
          <span className="light-line h-px w-10" aria-hidden="true" />
          <span>How every project runs</span>
        </p>
        <p className="font-display max-w-[19ch] text-[clamp(2.4rem,6.4vw,5.8rem)] leading-[1.02]">
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
