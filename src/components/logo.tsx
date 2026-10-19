import { site } from "@/lib/content";

/*
  Build Studio monogram, traced from the original logo in the reference video:
  a squared S that wraps the frame, with a B set inside it. The S's middle
  bar doubles as the B's waist, the B has a chamfered notch at that waist,
  and a small gap separates it from the S's lower right tab. Drawn as
  centre-line strokes on a 64 x 72 grid so it can be animated as lines
  (see intro.tsx).
*/
export const MARK = {
  viewBox: "0 0 64 72",
  stroke: 6.75,
  /** Upper S: right terminal, top bar, left column, middle bar (B waist). */
  sTop: "M60.6 18V3.4H3.4V34.5H43.5",
  /** Lower S: right tab, right column, bottom bar, left terminal. */
  sBottom: "M53 34.5H60.6V68.6H3.4V52",
  /** The B: bowls with a notched waist; the S middle bar is its waist. */
  b: "M41 34.5L45.5 30V21.5H17V53H45.5V39Z",
} as const;

export function Monogram({ className, title }: { className?: string; title?: string }) {
  return (
    <svg
      viewBox={MARK.viewBox}
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={MARK.stroke}
      strokeLinecap="butt"
      strokeLinejoin="miter"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <path d={MARK.sTop} />
      <path d={MARK.sBottom} />
      <path d={MARK.b} />
    </svg>
  );
}

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <Monogram className="site-logo-mark h-7 w-[1.556rem] shrink-0" />
      <span className="intro-fade label !text-[0.72rem] !tracking-[0.32em] font-medium">{site.name}</span>
    </span>
  );
}
