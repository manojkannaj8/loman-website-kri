"use client";

import { AnimatePresence, motion } from "motion/react";
import { useRef, useState, type KeyboardEvent } from "react";
import { services, type Service } from "@/lib/content";
import { ArrowRight } from "../icons";
import { EASE, Reveal } from "../motion";
import { SectionHeading } from "../section-heading";
import { ServiceIllustration } from "../service-illustrations";
import { StartProjectLink } from "../start-project-link";

function ScopeTags({ scope }: { scope: readonly string[] }) {
  return (
    <ul className="flex flex-wrap gap-2" aria-label="Scope">
      {scope.map((s) => (
        <li key={s} className="label border border-line-on-ink px-3 py-2 text-paper/85">
          {s}
        </li>
      ))}
    </ul>
  );
}

function ServicePanel({ service, total }: { service: Service; total: number }) {
  return (
    <div className="grid h-full grid-rows-[auto_1fr_auto] gap-8 p-6 sm:p-10">
      <div className="flex items-center justify-between">
        <p className="label text-glow">Service {service.index}</p>
        <p className="label text-muted-on-ink">
          {service.index} / 0{total}
        </p>
      </div>
      <ServiceIllustration id={service.id} className="w-full max-w-[22rem] self-center text-paper/80" />
      <div className="grid gap-6">
        <h3 className="font-display text-[clamp(1.9rem,3vw,2.6rem)] font-medium leading-tight">{service.title}</h3>
        <p className="max-w-[46ch] text-[1.0625rem] leading-relaxed text-muted-on-ink">{service.summary}</p>
        <ScopeTags scope={service.scope} />
      </div>
    </div>
  );
}

export function Services() {
  const items = services.items;
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  function onKeyDown(e: KeyboardEvent<HTMLButtonElement>, i: number) {
    const keys: Record<string, number> = {
      ArrowDown: (i + 1) % items.length,
      ArrowRight: (i + 1) % items.length,
      ArrowUp: (i - 1 + items.length) % items.length,
      ArrowLeft: (i - 1 + items.length) % items.length,
      Home: 0,
      End: items.length - 1,
    };
    if (!(e.key in keys)) return;
    e.preventDefault();
    const next = keys[e.key];
    setActive(next);
    tabs.current[next]?.focus();
  }

  return (
    <section id="services" aria-labelledby="services-title" className="bg-paper-2 py-24 lg:py-36">
      <div className="container-x">
        <SectionHeading
          id="services-title"
          index="02"
          eyebrow="Services"
          heading={services.heading}
          intro={services.intro}
        />

        {/* Desktop: index list + specification panel */}
        <div className="mt-16 hidden gap-8 lg:grid lg:grid-cols-12">
          <div className="col-span-5">
          <div role="tablist" aria-orientation="vertical" aria-label="Services" className="border-t border-line-strong">
            {items.map((s, i) => {
              const selected = i === active;
              return (
                <button
                  key={s.id}
                  ref={(el) => {
                    tabs.current[i] = el;
                  }}
                  role="tab"
                  id={`tab-${s.id}`}
                  aria-selected={selected}
                  aria-controls={`panel-${s.id}`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActive(i)}
                  onMouseEnter={() => setActive(i)}
                  onKeyDown={(e) => onKeyDown(e, i)}
                  className={`group relative grid w-full grid-cols-[3.5rem_1fr_auto] items-center border-b border-line-strong py-8 text-left transition-colors duration-300 ${
                    selected ? "text-ink" : "text-ink/60 hover:text-ink/85"
                  }`}
                >
                  {selected ? (
                    <motion.span
                      layoutId="service-indicator"
                      className="absolute -left-4 top-0 h-full w-[3px] bg-timber"
                      transition={{ duration: 0.5, ease: EASE }}
                    />
                  ) : null}
                  <span className={`font-display opsz-text text-[1.05rem] italic ${selected ? "text-timber" : "text-muted"}`}>{s.index}</span>
                  <span className="font-display text-[clamp(1.6rem,2.6vw,2.4rem)] font-medium leading-none">
                    {s.title}
                  </span>
                  <ArrowRight
                    size={20}
                    className={`transition-all duration-500 ease-out-expo ${
                      selected ? "translate-x-0 opacity-100" : "-translate-x-3 opacity-0"
                    }`}
                  />
                </button>
              );
            })}
          </div>
            <div className="mt-10 grid gap-4 pr-8">
              <p className="max-w-[34ch] leading-relaxed text-muted">
                Not sure which suits your project? Describe it and Loman will advise.
              </p>
              <StartProjectLink className="label inline-flex w-fit items-center gap-3 border-b border-timber pb-2 text-ink transition-colors hover:text-timber">
                Start a conversation
                <ArrowRight size={14} />
              </StartProjectLink>
            </div>
          </div>

          <div className="on-ink dusk-light-side relative col-span-7 min-h-[34rem] overflow-hidden text-paper">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={items[active].id}
                role="tabpanel"
                id={`panel-${items[active].id}`}
                aria-labelledby={`tab-${items[active].id}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.45, ease: EASE }}
                className="relative h-full"
              >
                <ServicePanel service={items[active]} total={items.length} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile and tablet: every service shown in full */}
        <div className="mt-12 grid gap-4 lg:hidden">
          {items.map((s, i) => (
            <Reveal key={s.id} delay={i * 0.05}>
              <article aria-labelledby={`m-${s.id}`} className="on-ink dusk-light-side relative overflow-hidden text-paper">
                <div className="relative grid gap-6 p-6 sm:p-8">
                  <div className="flex items-center justify-between">
                    <p className="label text-glow">Service {s.index}</p>
                    <ServiceIllustration id={s.id} className="w-28 text-paper/70" />
                  </div>
                  <h3 id={`m-${s.id}`} className="font-display text-[1.9rem] font-medium leading-tight">
                    {s.title}
                  </h3>
                  <p className="leading-relaxed text-muted-on-ink">{s.summary}</p>
                  <ScopeTags scope={s.scope} />
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
