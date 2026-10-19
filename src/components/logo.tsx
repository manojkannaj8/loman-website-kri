import { site } from "@/lib/content";

// Monogram redrawn from the reference: an interlocking S and B built from
// square-cut strokes. Swap for the official vector mark when available.
export function Monogram({ className, title }: { className?: string; title?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={3.2}
      strokeLinecap="square"
      strokeLinejoin="miter"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <path d="M35 4.5H5V20h30v15.5H5" />
      <path d="M13 12.25h22M5 27.75h22" />
    </svg>
  );
}

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <Monogram className="h-7 w-7 shrink-0" />
      <span className="label !text-[0.72rem] !tracking-[0.32em] font-medium">{site.name}</span>
    </span>
  );
}
