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
          <SectionHeading id="about-title" sheet="A-01" eyebrow="About" heading={about.heading} />

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
                <span className="mt-[0.55em] h-1.5 w-1.5 shrink-0 rotate-45 bg-oxide" aria-hidden="true" />
                {about.base}
              </p>
            </Reveal>
          </div>
        </div>

        <Reveal className="w-full max-w-[28rem] lg:col-span-5 lg:col-start-8 lg:max-w-none" delay={0.1}>
          <article aria-labelledby="founder-name" className="border border-line-strong bg-paper">
            <div className="flex items-center justify-between border-b border-line-strong px-5 py-3">
              <p className="label text-oxide">The founder</p>
              <p className="label text-muted">A-01.1</p>
            </div>

            <div className="group relative aspect-[4/3] overflow-hidden bg-ink">
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
                <h3 id="founder-name" className="font-display text-[1.75rem] font-medium leading-tight">
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
                      <span className="font-mono text-[0.7rem] text-oxide">0{i + 1}</span>
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
