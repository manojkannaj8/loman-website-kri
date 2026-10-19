"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { buildProcess } from "@/lib/content";
import type { HouseScene } from "../house-scene";
import { EASE } from "../motion";
import { SectionHeading } from "../section-heading";

const STEP_MS = 2800;
const last = buildProcess.steps.length - 1;

export function Process() {
  const reduce = useReducedMotion() ?? false;
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const scene = useRef<HouseScene | null>(null);
  const [step, setStep] = useState(0);
  const [autoplay, setAutoplay] = useState(false);
  const [webgl, setWebgl] = useState(true);
  const started = useRef(false);

  // Load three.js only when the section comes near, and render only while visible.
  useEffect(() => {
    const el = section.current;
    if (!el) return;
    let disposed = false;
    const load = new IntersectionObserver(
      async ([entry]) => {
        if (!entry.isIntersecting || scene.current || !stage.current) return;
        load.disconnect();
        const { createHouseScene } = await import("../house-scene");
        if (disposed || !stage.current) return;
        const created = createHouseScene(stage.current, { reduced: reduce });
        if (!created) setWebgl(false);
        scene.current = created;
      },
      { rootMargin: "600px 0px" },
    );
    const visible = new IntersectionObserver(
      ([entry]) => {
        scene.current?.setActive(entry.isIntersecting);
        // Play the sequence the first time the section is properly in view.
        if (entry.intersectionRatio > 0.45 && !started.current) {
          started.current = true;
          if (reduce) setStep(last);
          else setAutoplay(true);
        }
      },
      { threshold: [0, 0.45] },
    );
    load.observe(el);
    visible.observe(el);
    return () => {
      disposed = true;
      load.disconnect();
      visible.disconnect();
      scene.current?.dispose();
      scene.current = null;
    };
  }, [reduce]);

  useEffect(() => {
    scene.current?.setStep(step);
  }, [step]);

  // Autoplay runs until the last step; "playing" is derived, so nothing resets it in an effect.
  const playing = autoplay && step < last;
  useEffect(() => {
    if (!playing) return;
    const id = window.setTimeout(() => setStep((s) => Math.min(last, s + 1)), STEP_MS);
    return () => window.clearTimeout(id);
  }, [playing, step]);

  const go = useCallback((next: number) => {
    setAutoplay(false);
    setStep(Math.max(0, Math.min(last, next)));
  }, []);

  const replay = useCallback(() => {
    setStep(0);
    setAutoplay(!reduce);
  }, [reduce]);

  const current = buildProcess.steps[step];

  return (
    <section
      ref={section}
      id="process"
      aria-labelledby="process-title"
      className="on-ink dusk-light-side relative overflow-hidden text-paper"
    >
      <div className="relative min-h-[100svh] lg:min-h-[52rem]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-[34%] z-[1] hidden w-56 bg-gradient-to-r from-dusk to-transparent lg:block"
        />

        <div className="container-x flex min-h-[100svh] flex-col py-24 lg:min-h-[52rem] lg:py-32">
          <SectionHeading id="process-title" index="03" eyebrow={buildProcess.eyebrow} heading={buildProcess.heading} tone="ink" className="relative z-10 max-w-md" />

          {/* The 3D stage: its own band on phones, the right two thirds on desktop. */}
          <div
            ref={stage}
            aria-hidden="true"
            className="relative -mx-5 my-6 h-[clamp(20rem,80vw,30rem)] sm:-mx-8 lg:absolute lg:inset-0 lg:left-[34%] lg:m-0 lg:h-auto"
          />

          <div className="relative z-10 mt-auto max-w-sm lg:mt-20">
            <div className="relative min-h-[11rem]" aria-live="polite">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={current.index}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.45, ease: EASE }}
                >
                  <p className="font-display opsz-text text-[1.05rem] italic text-glow">
                    {current.index}
                    <span className="sr-only"> of 0{buildProcess.steps.length}</span>
                  </p>
                  <h3 className="font-display mt-2 text-[clamp(1.8rem,3vw,2.4rem)] leading-tight">{current.title}</h3>
                  <p className="mt-3 leading-relaxed text-muted-on-ink">{current.body}</p>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="mt-8 flex items-center gap-5">
              <div className="flex flex-1 gap-2" aria-hidden="true">
                {buildProcess.steps.map((s, i) => (
                  <span key={s.index} className="relative h-px flex-1 overflow-hidden bg-paper/15">
                    <span
                      className={`light-line absolute inset-0 origin-left transition-transform duration-700 ease-out-expo ${
                        i <= step ? "scale-x-100" : "scale-x-0"
                      }`}
                    />
                  </span>
                ))}
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  aria-label="Previous step"
                  onClick={() => go(step - 1)}
                  disabled={step === 0}
                  className="grid h-11 w-11 cursor-pointer place-items-center rounded-full border border-paper/25 transition-colors hover:border-glow hover:text-glow disabled:cursor-default disabled:opacity-30 disabled:hover:border-paper/25 disabled:hover:text-paper"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                    <path d="M15 5 8 12l7 7" />
                  </svg>
                </button>
                <button
                  type="button"
                  aria-label="Next step"
                  onClick={() => go(step + 1)}
                  disabled={step === last}
                  className="grid h-11 w-11 cursor-pointer place-items-center rounded-full border border-paper/25 transition-colors hover:border-glow hover:text-glow disabled:cursor-default disabled:opacity-30 disabled:hover:border-paper/25 disabled:hover:text-paper"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                    <path d="m9 5 7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={replay}
              className={`label mt-6 cursor-pointer text-muted-on-ink transition-[color,opacity] duration-500 hover:text-glow ${
                step === last && !playing ? "opacity-100" : "pointer-events-none opacity-0"
              }`}
              tabIndex={step === last && !playing ? 0 : -1}
            >
              Watch it again
            </button>

            {!webgl ? (
              <ol className="mt-8 grid gap-3 text-[0.95rem] text-muted-on-ink">
                {buildProcess.steps.map((s) => (
                  <li key={s.index}>
                    <span className="text-glow">{s.index}</span> {s.title}
                  </li>
                ))}
              </ol>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
