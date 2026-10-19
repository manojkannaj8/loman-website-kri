import { Reveal } from "./motion";

type Props = {
  index: string;
  eyebrow: string;
  heading: string;
  intro?: string;
  id?: string;
  tone?: "paper" | "ink";
  className?: string;
};

/** Section header: numbered eyebrow with a short light line, then a Bodoni title. */
export function SectionHeading({ index, eyebrow, heading, intro, id, tone = "paper", className = "" }: Props) {
  const muted = tone === "ink" ? "text-muted-on-ink" : "text-muted";
  const accent = tone === "ink" ? "text-glow" : "text-timber";
  const line = tone === "ink" ? "light-line" : "bg-timber";
  return (
    <div className={className}>
      <Reveal>
        <p className={`label flex items-center gap-3 ${muted}`}>
          <span className={`font-display opsz-text text-[0.95rem] italic tracking-normal normal-case ${accent}`}>{index}</span>
          <span className={`h-px w-10 ${line}`} aria-hidden="true" />
          <span>{eyebrow}</span>
        </p>
      </Reveal>
      <Reveal delay={0.06}>
        <h2
          id={id}
          className="font-display mt-6 max-w-[17ch] text-[clamp(2.3rem,5vw,4.4rem)] leading-[1.02] text-balance"
        >
          {heading}
        </h2>
      </Reveal>
      {intro ? (
        <Reveal delay={0.12}>
          <p className={`mt-6 max-w-[50ch] text-[1.0625rem] leading-relaxed sm:text-[1.125rem] ${muted}`}>{intro}</p>
        </Reveal>
      ) : null}
    </div>
  );
}
