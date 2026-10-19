"use client";

import { animate, motion, useAnimate } from "motion/react";
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { site } from "@/lib/content";
import { INTRO_STORAGE_KEY } from "@/lib/intro";
import { MARK } from "./logo";
import { EASE } from "./motion";

/*
  Opening logo animation.

  An inline script in layout.tsx decides before first paint whether the intro
  plays (`html[data-intro="play"]`) or is skipped (seen this session, or
  reduced motion). CSS shows the overlay only in the "play" state, so there is
  no flash and no layout shift either way, and without JavaScript nothing shows.

  Sequence: setting-out lines sweep across, the monogram is traced as fine
  pencil lines, the strokes thicken to their full weight, the wordmark settles,
  then the mark flies into the header logo while the overlay dissolves and the
  hero begins its own entrance.
*/

const IntroContext = createContext(true);

/** True once the page may run its entrance animations (immediately when the intro is skipped). */
export function useIntroReady() {
  return useContext(IntroContext);
}

export function IntroProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const play = document.documentElement.dataset.intro === "play";
    // Reading the pre-paint decision once on mount; there is no external store to subscribe to.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (play) setPlaying(true);
    else setReady(true);
  }, []);

  const release = useCallback(() => setReady(true), []);
  const finish = useCallback(() => {
    document.documentElement.dataset.intro = "done";
    setPlaying(false);
    setReady(true);
  }, []);

  return (
    <IntroContext.Provider value={ready}>
      {children}
      {playing ? <IntroOverlay onRelease={release} onFinish={finish} /> : <IntroOverlayShell />}
    </IntroContext.Provider>
  );
}

/** Server-rendered placeholder so the overlay covers the page before hydration. */
function IntroOverlayShell() {
  return <div className="intro-overlay" aria-hidden="true" />;
}

const PENCIL = 0.9;
// Timeline in seconds from mount.
const t = {
  lines: 0,
  sTop: 0.15,
  sBottom: 0.4,
  b: 0.65,
  draw: 0.95,
  ink: 1.4,
  word: 1.45,
  exit: 2.3,
};

function IntroOverlay({ onRelease, onFinish }: { onRelease: () => void; onFinish: () => void }) {
  const [scope, animateScope] = useAnimate();
  const markRef = useRef<SVGSVGElement>(null);
  const exiting = useRef(false);

  const exit = useCallback(
    async (fast = false) => {
      if (exiting.current) return;
      exiting.current = true;
      try {
        window.sessionStorage.setItem(INTRO_STORAGE_KEY, "1");
      } catch {}
      onRelease();

      const mark = markRef.current;
      const target = document.querySelector<SVGSVGElement>("header .site-logo-mark");
      const duration = fast ? 0.55 : 0.95;
      // The wordmark clears first, the mark then docks in the header, and the
      // curtain lifts on a gentle in-out curve so the docking stays readable.
      const lead = fast ? 0 : 0.12;
      const moves: Promise<unknown>[] = [
        animateScope(".intro-word, .intro-guides", { opacity: 0 }, { duration: 0.25 }).finished,
        animateScope(
          scope.current,
          { backgroundColor: "rgba(29,26,23,0)" },
          { duration: duration + 0.1, ease: [0.65, 0, 0.35, 1], delay: lead + 0.1 },
        ).finished,
      ];

      if (mark && target) {
        const from = mark.getBoundingClientRect();
        const to = target.getBoundingClientRect();
        const scale = to.height / from.height;
        const dx = to.left + to.width / 2 - (from.left + from.width / 2);
        const dy = to.top + to.height / 2 - (from.top + from.height / 2);
        moves.push(
          animate(
            mark,
            { x: dx, y: dy, scale, color: getComputedStyle(target).color },
            { duration, ease: EASE, delay: lead },
          ).finished,
        );
      } else if (mark) {
        moves.push(animate(mark, { opacity: 0 }, { duration: duration * 0.6 }).finished);
      }

      await Promise.all(moves);
      onFinish();
    },
    [animateScope, onFinish, onRelease, scope],
  );

  useEffect(() => {
    const timer = window.setTimeout(() => exit(), t.exit * 1000);
    // Any intent to use the page skips straight to the handoff.
    const skip = () => exit(true);
    const events = ["keydown", "pointerdown", "wheel", "touchmove"] as const;
    events.forEach((e) => window.addEventListener(e, skip, { passive: true }));
    return () => {
      window.clearTimeout(timer);
      events.forEach((e) => window.removeEventListener(e, skip));
    };
  }, [exit]);

  const path = (d: string, delay: number) => (
    <motion.path
      d={d}
      initial={{ pathLength: 0, strokeWidth: PENCIL }}
      animate={{ pathLength: 1, strokeWidth: MARK.stroke }}
      transition={{
        pathLength: { delay, duration: t.draw, ease: [0.65, 0, 0.35, 1] },
        strokeWidth: { delay: t.ink, duration: 0.6, ease: EASE },
      }}
    />
  );

  return (
    <div ref={scope} className="intro-overlay intro-overlay--live" aria-hidden="true">
      <div className="relative flex flex-col items-center">
        {/* Setting-out lines: hairlines that sweep out along the mark's edges. */}
        <div className="intro-guides pointer-events-none absolute left-1/2 top-0 aspect-[64/72] w-[clamp(4.5rem,13vw,7.5rem)] -translate-x-1/2">
          {[
            { cls: "left-1/2 top-[4.7%] h-px w-[300vw] -translate-x-1/2", from: { scaleX: 0 }, to: { scaleX: 1 } },
            { cls: "left-1/2 bottom-[4.7%] h-px w-[300vw] -translate-x-1/2", from: { scaleX: 0 }, to: { scaleX: 1 } },
            { cls: "top-1/2 left-[5.3%] w-px h-[300vh] -translate-y-1/2", from: { scaleY: 0 }, to: { scaleY: 1 } },
            { cls: "top-1/2 right-[5.3%] w-px h-[300vh] -translate-y-1/2", from: { scaleY: 0 }, to: { scaleY: 1 } },
          ].map((g, i) => (
            <motion.span
              key={i}
              className={`absolute bg-glow/25 ${g.cls}`}
              initial={{ ...g.from, opacity: 1 }}
              animate={{ ...g.to, opacity: [1, 1, 0] }}
              transition={{
                default: { delay: t.lines + i * 0.08, duration: 1.1, ease: EASE },
                opacity: { delay: t.lines + i * 0.08, duration: 2.1, times: [0, 0.6, 1] },
              }}
            />
          ))}
        </div>

        <svg
          ref={markRef}
          viewBox={MARK.viewBox}
          className="relative w-[clamp(4.5rem,13vw,7.5rem)] overflow-visible text-glow"
          fill="none"
          stroke="currentColor"
          strokeLinecap="butt"
          strokeLinejoin="miter"
        >
          {path(MARK.sTop, t.sTop)}
          {path(MARK.sBottom, t.sBottom)}
          {path(MARK.b, t.b)}
        </svg>

        <motion.p
          className="intro-word label mt-7 whitespace-nowrap text-[clamp(0.72rem,1.6vw,0.85rem)] text-glow/90"
          initial={{ opacity: 0, letterSpacing: "0.7em", y: 6 }}
          animate={{ opacity: 1, letterSpacing: "0.42em", y: 0 }}
          transition={{ delay: t.word, duration: 0.9, ease: EASE }}
          style={{ marginRight: "-0.42em" }}
        >
          {site.name}
        </motion.p>
      </div>
    </div>
  );
}
