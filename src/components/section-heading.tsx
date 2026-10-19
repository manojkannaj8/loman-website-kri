import { Reveal } from "./motion";

type Props = {
  sheet: string;
  eyebrow: string;
  heading: string;
  intro?: string;
  id?: string;
  tone?: "paper" | "ink";
  className?: string;
};

/**
 * Section header styled as a drawing-sheet annotation: sheet reference,
 * a hairline, then the title.
 */
export function SectionHeading({ sheet, eyebrow, heading, intro, id, tone = "paper", className = "" }: Props) {
  const muted = tone === "ink" ? "text-muted-on-ink" : "text-muted";
  const rule = tone === "ink" ? "bg-line-on-ink" : "bg-line-strong";
  const accent = tone === "ink" ? "text-oxide-bright" : "text-oxide";
  return (
    <div className={className}>
      <Reveal>
        <p className={`label flex items-center gap-3 ${muted}`}>
          <span className={accent}>{sheet}</span>
          <span className={`h-px w-8 ${rule}`} aria-hidden="true" />
          <span>{eyebrow}</span>
        </p>
      </Reveal>
      <Reveal delay={0.06}>
        <h2
          id={id}
          className="font-display mt-6 max-w-[18ch] text-[clamp(2.1rem,4.6vw,3.9rem)] font-medium leading-[1.02] text-balance"
        >
          {heading}
        </h2>
      </Reveal>
      {intro ? (
        <Reveal delay={0.12}>
          <p className={`mt-6 max-w-[52ch] text-[1.0625rem] leading-relaxed ${muted}`}>{intro}</p>
        </Reveal>
      ) : null}
    </div>
  );
}
