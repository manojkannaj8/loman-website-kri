import Image from "next/image";
import { about } from "@/lib/content";
import { Reveal } from "../motion";
import { SectionHeading } from "../section-heading";
import founderPhoto from "../../../public/images/loman-byrne.jpg";

export function About() {
  const { founder } = about;
  return (
    <section id="about" aria-labelledby="about-title" className="border-t border-line py-24 lg:py-36">
      <div className="container-x grid gap-16 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-6">
          <SectionHeading id="about-title" index="01" eyebrow="About" heading={about.heading} />

          <div className="mt-12 grid max-w-[54ch] gap-6 text-[1.0625rem] leading-relaxed text-muted lg:mt-16">
            <Reveal>
              <p>{about.intro}</p>
            </Reveal>
            <Reveal delay={0.05}>
              <p>
                {about.focus} <strong className="font-medium text-ink">{about.promise}</strong>
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="flex items-start gap-3 border-t border-line pt-6 text-ink">
                <span className="mt-[0.8em] h-px w-6 shrink-0 bg-timber" aria-hidden="true" />
                {about.base}
              </p>
            </Reveal>
          </div>
        </div>

        <Reveal className="w-full max-w-[28rem] lg:col-span-5 lg:col-start-8 lg:max-w-none" delay={0.1}>
          <article aria-labelledby="founder-name" className="relative bg-paper-2 shadow-[0_30px_60px_-30px_rgb(29_26_23/0.35)]">

            <div className="group relative aspect-[4/3] overflow-hidden bg-dusk">
              <Image
                src={founderPhoto}
                alt="Loman Byrne, founder of Build Studio, wearing a Build Studio gilet"
                fill
                sizes="(min-width: 1024px) 34vw, 100vw"
                placeholder="blur"
                className="object-cover transition-transform duration-[1.4s] ease-out-expo group-hover:scale-[1.03]"
              />
            </div>

            <div className="grid gap-6 p-5 sm:p-7">
              <div>
                <p className="label mb-3 text-timber">The founder</p>
                <h3 id="founder-name" className="font-display text-[2.1rem] leading-tight">
                  {founder.name}
                </h3>
                <p className="mt-1 text-[0.95rem] text-muted">{founder.title}</p>
              </div>
              <p className="leading-relaxed">{founder.bio}</p>
              <div className="border-t border-line pt-5">
                <p className="label mb-4 text-muted">Qualifications &amp; expertise</p>
                <ul className="grid gap-3">
                  {founder.credentials.map((c, i) => (
                    <li key={c} className="grid grid-cols-[2rem_1fr] items-baseline text-[0.95rem]">
                      <span className="font-display opsz-text text-[0.95rem] italic text-timber">0{i + 1}</span>
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </article>
        </Reveal>
      </div>
    </section>
  );
}
