import { why } from "@/lib/content";
import { Reveal } from "../motion";
import { SectionHeading } from "../section-heading";

export function Why() {
  return (
    <section id="why" aria-labelledby="why-title" className="on-ink dusk-light-side relative overflow-hidden py-24 text-paper lg:py-36">
      <div className="container-x relative">
        <SectionHeading id="why-title" index="04" eyebrow={why.eyebrow} heading={why.heading} tone="ink" />

        <ol className="mt-16 grid border-l border-t border-line-on-ink md:grid-cols-2 lg:mt-20">
          {why.items.map((item, i) => (
            <li key={item.index} className="group relative border-b border-r border-line-on-ink">
              <Reveal delay={(i % 2) * 0.08} className="h-full">
                <div className="grid h-full gap-5 p-6 sm:p-10 lg:grid-cols-[5.5rem_1fr]">
                  <span
                    aria-hidden="true"
                    className="font-display text-[3.2rem] italic leading-none text-glow transition-transform duration-700 ease-out-expo group-hover:-translate-y-1"
                  >
                    {item.index}
                  </span>
                  <div>
                    <h3 className="font-display text-[1.6rem] leading-snug">{item.title}</h3>
                    <p className="mt-4 max-w-[44ch] leading-relaxed text-muted-on-ink">{item.body}</p>
                  </div>
                </div>
              </Reveal>
              <span
                aria-hidden="true"
                className="light-line absolute inset-x-0 top-0 h-px origin-left scale-x-0 transition-transform duration-700 ease-out-expo group-hover:scale-x-100"
              />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
