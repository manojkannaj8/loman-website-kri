import { experience } from "@/lib/content";
import { Reveal } from "../motion";
import { SectionHeading } from "../section-heading";

export function Experience() {
  return (
    <section id="experience" aria-labelledby="experience-title" className="py-24 lg:py-36">
      <div className="container-x">
        <SectionHeading id="experience-title" index="04" eyebrow="Experience" heading={experience.heading} />

        <div className="mt-14 grid gap-14 lg:mt-20 lg:grid-cols-12 lg:gap-8">
          <Reveal className="lg:col-span-4">
            <p className="label mb-4 text-timber">Sectors</p>
            <ul className="border-t border-line-strong">
              {experience.sectors.map((s, i) => (
                <li
                  key={s}
                  className="group flex items-baseline gap-4 border-b border-line-strong py-4 transition-colors duration-300 hover:text-timber"
                >
                  <span className="font-display opsz-text w-6 text-[0.95rem] italic text-muted">0{i + 1}</span>
                  <span className="font-display opsz-text text-[1.3rem] leading-snug">{s}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          <div className="grid content-start gap-6 lg:col-span-7 lg:col-start-6">
            {experience.body.map((p, i) => (
              <Reveal key={i} delay={0.05 * i}>
                <p
                  className={
                    i === 0
                      ? "font-display opsz-text text-[clamp(1.3rem,1.9vw,1.6rem)] leading-[1.45]"
                      : "max-w-[62ch] leading-relaxed text-muted"
                  }
                >
                  {p}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
