import { about } from "@/lib/content";
import { Reveal } from "../motion";
import { SectionHeading } from "../section-heading";

export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="border-t border-line py-24 lg:py-36">
      <div className="container-x">
        <SectionHeading id="about-title" index="01" eyebrow="About" heading={about.heading} />

        <div className="mt-14 grid gap-12 lg:mt-20 lg:grid-cols-12 lg:gap-8">
          <Reveal className="lg:col-span-6">
            <p className="font-display opsz-text text-[clamp(1.35rem,2vw,1.7rem)] leading-[1.45]">{about.lead}</p>
          </Reveal>

          <div className="grid content-start gap-10 lg:col-span-5 lg:col-start-8">
            <div className="grid gap-6 leading-relaxed text-muted">
              {about.body.map((p, i) => (
                <Reveal key={i} delay={0.05 * (i + 1)}>
                  <p>{p}</p>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.15}>
              <div className="on-ink dusk-light-side p-7 text-paper sm:p-9">
                <p className="label text-glow">Qualifications &amp; expertise</p>
                <ul className="mt-6 grid border-t border-line-on-ink sm:grid-cols-2">
                  {about.credentials.map((c, i) => (
                    <li
                      key={c}
                      className="flex items-baseline gap-3 border-b border-line-on-ink py-4 text-[0.95rem] sm:pr-4"
                    >
                      <span className="font-display opsz-text text-[0.95rem] italic text-glow">0{i + 1}</span>
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
