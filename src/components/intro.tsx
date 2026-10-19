"use client";

import { animate } from "motion/react";
import { createContext, useCallback, useContext, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { site } from "@/lib/content";
import { MARK } from "./logo";
import { EASE } from "./motion";

/*
  Opening logo animation.

  An inline script in layout.tsx decides before first paint whether the intro
  plays (`html[data-intro="play"]`, every full page load) or is skipped
  (reduced motion). CSS shows the overlay only in the "play" state, so there
  is no flash and no layout shift either way, and without JavaScript nothing
  shows.

  The drawing itself is pure CSS (see "Logo intro" in globals.css) and is
  server-rendered, so it starts at first paint instead of waiting for
  JavaScript: setting-out lines sweep across, the monogram is traced as fine
  pencil lines, the strokes thicken to full weight and the wordmark settles.
  Once hydrated, this component runs the handoff: the mark flies into the
  header logo while the overlay lifts and the hero begins its entrance.
*/

/** Seconds after first paint when the handoff starts (drawing is done by then). */
const HANDOFF_AT = 2.3;

const IntroContext = createContext(true);

/** True once the page may run its entrance animations (immediately when the intro is skipped). */
export function useIntroReady() {
  return useContext(IntroContext);
}

export function IntroProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Reading the pre-paint decision once on mount; there is no external store to subscribe to.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (document.documentElement.dataset.intro !== "play") setReady(true);
  }, []);

  const release = useCallback(() => setReady(true), []);

  return (
    <IntroContext.Provider value={ready}>
      {children}
      <IntroOverlay onRelease={release} />
    </IntroContext.Provider>
  );
}

const guides: { cls: string; delay: number }[] = [
  { cls: "intro-guide-h left-1/2 top-[4.7%] h-px w-[300vw] -translate-x-1/2", delay: 0 },
  { cls: "intro-guide-h left-1/2 bottom-[4.7%] h-px w-[300vw] -translate-x-1/2", delay: 0.08 },
  { cls: "intro-guide-v top-1/2 left-[5.3%] w-px h-[300vh] -translate-y-1/2", delay: 0.16 },
  { cls: "intro-guide-v top-1/2 right-[5.3%] w-px h-[300vh] -translate-y-1/2", delay: 0.24 },
];

const strokes: { d: string; delay: number }[] = [
  { d: MARK.sTop, delay: 0.15 },
  { d: MARK.sBottom, delay: 0.4 },
  { d: MARK.b, delay: 0.65 },
];

function IntroOverlay({ onRelease }: { onRelease: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const mark = useRef<SVGSVGElement>(null);
  const fadeFirst = useRef<HTMLDivElement[]>([]);
  const exiting = useRef(false);

  const exit = useCallback(
    async (fast = false) => {
      if (exiting.current || !root.current) return;
      exiting.current = true;
      onRelease();

      const duration = fast ? 0.55 : 0.95;
      // The wordmark clears first, the mark then docks in the header, and the
      // curtain lifts on a gentle in-out curve so the docking stays readable.
      const lead = fast ? 0 : 0.12;
      const moves: Promise<unknown>[] = [
        ...fadeFirst.current.map((el) => animate(el, { opacity: 0 }, { duration: 0.25 }).finished),
        animate(
          root.current,
          { backgroundColor: "rgba(29,26,23,0)" },
          { duration: duration + 0.1, ease: [0.65, 0, 0.35, 1], delay: lead + 0.1 },
        ).finished,
      ];

      const target = document.querySelector<SVGSVGElement>("header .site-logo-mark");
      if (mark.current && target) {
        const from = mark.current.getBoundingClientRect();
        const to = target.getBoundingClientRect();
        moves.push(
          animate(
            mark.current,
            {
              x: to.left + to.width / 2 - (from.left + from.width / 2),
              y: to.top + to.height / 2 - (from.top + from.height / 2),
              scale: to.height / from.height,
              color: getComputedStyle(target).color,
            },
            { duration, ease: EASE, delay: lead },
          ).finished,
        );
      } else if (mark.current) {
        moves.push(animate(mark.current, { opacity: 0 }, { duration: duration * 0.6 }).finished);
      }

      await Promise.all(moves);
      document.documentElement.dataset.intro = "done";
    },
    [onRelease],
  );

  useEffect(() => {
    if (document.documentElement.dataset.intro !== "play") return;
    // The CSS drawing started at first paint; hand off once it has had its time.
    const start = (window as Window & { __introStart?: number }).__introStart ?? performance.now();
    const wait = Math.max(0, HANDOFF_AT * 1000 - (performance.now() - start));
    const timer = window.setTimeout(() => exit(), wait);
    // Any intent to use the page skips straight to the handoff.
    const skip = () => exit(true);
    const events = ["keydown", "pointerdown", "wheel", "touchmove"] as const;
    events.forEach((e) => window.addEventListener(e, skip, { passive: true }));
    return () => {
      window.clearTimeout(timer);
      events.forEach((e) => window.removeEventListener(e, skip));
    };
  }, [exit]);

  return (
    <div ref={root} className="intro-overlay" aria-hidden="true">
      <div className="relative flex flex-col items-center">
        {/* Setting-out lines: hairlines that sweep out along the mark's edges. */}
        <div
          ref={(el) => {
            if (el) fadeFirst.current[0] = el;
          }}
          className="pointer-events-none absolute left-1/2 top-0 aspect-[64/72] w-[clamp(4.5rem,13vw,7.5rem)] -translate-x-1/2"
        >
          {guides.map((g, i) => (
            <span key={i} className={`absolute bg-glow/25 ${g.cls}`} style={{ "--d": `${g.delay}s` } as CSSProperties} />
          ))}
        </div>

        <svg
          ref={mark}
          viewBox={MARK.viewBox}
          className="relative w-[clamp(4.5rem,13vw,7.5rem)] overflow-visible text-glow"
          fill="none"
          stroke="currentColor"
          strokeLinecap="butt"
          strokeLinejoin="miter"
        >
          {strokes.map((s) => (
            <path key={s.d} d={s.d} pathLength={1} className="intro-path" style={{ "--d": `${s.delay}s` } as CSSProperties} />
          ))}
        </svg>

        <div
          ref={(el) => {
            if (el) fadeFirst.current[1] = el;
          }}
          className="mt-7"
        >
          <p
            className="intro-word label whitespace-nowrap text-[clamp(0.72rem,1.6vw,0.85rem)] text-glow/90"
            style={{ marginRight: "-0.42em" }}
          >
            {site.name}
          </p>
        </div>
      </div>
    </div>
  );
}
