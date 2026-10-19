import Image from "next/image";
import { site } from "@/lib/content";
import officialMark from "../../public/images/logo/build-studio-monogram-bronze.png";

/*
  Build Studio monogram, traced from the original logo in the reference video:
  a squared S that wraps the frame, with a B set inside it. The S's middle
  bar doubles as the B's waist, the B has a chamfered notch at that waist,
  and a small gap separates it from the S's lower right tab. Drawn as
  centre-line strokes on a 64 x 72 grid so it can be animated as lines
  (see intro.tsx). Everywhere the logo is simply shown, the official bronze
  PNG (OfficialMark) is used instead; this tracing also drives the favicon.
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

/**
 * The client's official bronze monogram (public/images/logo, from the live
 * preview). Decorative wherever the name is also written next to it.
 */
export function OfficialMark({ className = "", priority = false }: { className?: string; priority?: boolean }) {
  return (
    <Image
      src={officialMark}
      alt=""
      aria-hidden="true"
      priority={priority}
      sizes="(min-width: 1024px) 64px, 48px"
      className={className}
    />
  );
}

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <OfficialMark priority className="site-logo-mark h-7 w-auto shrink-0" />
      <span className="intro-fade label !text-[0.72rem] !tracking-[0.32em] font-medium">{site.name}</span>
    </span>
  );
}
