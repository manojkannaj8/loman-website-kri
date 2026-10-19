"use client";

import Image, { type StaticImageData } from "next/image";
import { motion } from "motion/react";
import { useRef, useState, type KeyboardEvent } from "react";
import { services, type Service } from "@/lib/content";
import { ArrowRight } from "../icons";
import { EASE, Reveal } from "../motion";
import { SectionHeading } from "../section-heading";
import { StartProjectLink } from "../start-project-link";
import constructionPhoto from "../../../public/images/service-construction.webp";
import pmPhoto from "../../../public/images/service-project-management.webp";
import qsPhoto from "../../../public/images/service-quantity-surveying.webp";

type Photo = { src: StaticImageData; alt: string; focus: string };

// One photograph per service. `focus` is the crop centre used when the
// landscape photo is shown in the taller desktop frame.
const photos: Record<string, Photo> = {
  construction: {
    src: constructionPhoto,
    alt: "Tradespeople fitting out an open plan kitchen and living space, with drawings, a hard hat and stone samples on a table in the foreground",
    focus: "62% 50%",
  },
  "project-management": {
    src: pmPhoto,
    alt: "A client and two members of the project team reviewing drawings beside a scale model, in a home under construction overlooking the coast",
    focus: "70% 45%",
  },
  "quantity-surveying": {
    src: qsPhoto,
    alt: "A desk set up for costing, with a calculator, a programme open on a laptop, drawings, a measuring rule and a scale model",
    focus: "40% 55%",
  },
};

const total = services.items.length;
const pad = (n: number) => String(n).padStart(2, "0");

function ScopeTags({ scope }: { scope: readonly string[] }) {
  return (
    <ul className="flex flex-wrap gap-2" aria-label="Scope">
      {scope.map((s) => (
        <li key={s} className="label border border-line-strong px-3 py-2 text-ink/80">
          {s}
        </li>
      ))}
    </ul>
  );
}

function ConversationPrompt({ className = "" }: { className?: string }) {
  return (
    <div className={`grid gap-4 ${className}`}>
      <p className="max-w-[34ch] leading-relaxed text-muted">
        Not sure which suits your project? Describe it and Loman will advise.
      </p>
      <StartProjectLink className="label inline-flex w-fit items-center gap-3 border-b border-timber pb-2 text-ink transition-colors hover:text-timber">
        Start a conversation
        <ArrowRight size={14} />
      </StartProjectLink>
    </div>
  );
}

/** Desktop: the service index works as an accordion; the photograph beside it follows the open service. */
function ServiceIndex({ items }: { items: readonly Service[] }) {
  const [active, setActive] = useState(0);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const current = items[active];

  function onKeyDown(e: KeyboardEvent<HTMLButtonElement>, i: number) {
    const next: Record<string, number> = {
      ArrowDown: (i + 1) % items.length,
      ArrowUp: (i - 1 + items.length) % items.length,
      Home: 0,
      End: items.length - 1,
    };
    if (!(e.key in next)) return;
    e.preventDefault();
    buttons.current[next[e.key]]?.focus();
  }

  return (
    <div className="mt-16 hidden grid-cols-12 items-start gap-x-12 lg:grid xl:gap-x-16">
      <div className="col-span-5">
        <div className="border-t border-line-strong">
          {items.map((s, i) => {
            const open = i === active;
            return (
              <div key={s.id} className="relative border-b border-line-strong">
                {open ? (
                  <motion.span
                    layoutId="service-indicator"
                    aria-hidden="true"
                    className="absolute -left-5 top-0 h-full w-[2px] bg-timber"
                    transition={{ duration: 0.6, ease: EASE }}
                  />
                ) : null}
                <h3>
                  <button
                    ref={(el) => {
                      buttons.current[i] = el;
                    }}
                    type="button"
                    id={`service-btn-${s.id}`}
                    aria-expanded={open}
                    aria-controls={`service-panel-${s.id}`}
                    onClick={() => setActive(i)}
                    onKeyDown={(e) => onKeyDown(e, i)}
                    className={`group grid w-full cursor-pointer grid-cols-[3rem_1fr_auto] items-baseline py-7 text-left transition-colors duration-300 ${
                      open ? "text-ink" : "text-ink/60 hover:text-ink/85"
                    }`}
                  >
                    <span className={`font-display opsz-text text-[1.05rem] italic ${open ? "text-timber" : "text-muted"}`}>
                      {s.index}
                    </span>
                    <span className="font-display text-[clamp(1.75rem,2.5vw,2.4rem)] leading-none">{s.title}</span>
                    {/* Plus that turns into a minus when open. */}
                    <span aria-hidden="true" className="relative mr-1 h-3 w-3 self-center">
                      <span className="absolute left-0 top-1/2 h-px w-3 bg-current" />
                      <span
                        className={`absolute left-1/2 top-0 h-3 w-px bg-current transition-transform duration-500 ease-out-expo ${
                          open ? "scale-y-0" : "scale-y-100"
                        }`}
                      />
                    </span>
                  </button>
                </h3>
                <div
                  id={`service-panel-${s.id}`}
                  role="region"
                  aria-labelledby={`service-btn-${s.id}`}
                  inert={!open}
                  className="grid transition-[grid-template-rows,opacity] duration-700 ease-out-expo"
                  style={{ gridTemplateRows: open ? "1fr" : "0fr", opacity: open ? 1 : 0 }}
                >
                  <div className="overflow-hidden">
                    <div className="grid gap-6 pb-9 pl-12">
                      <p className="max-w-[42ch] text-[1.0625rem] leading-relaxed text-muted">{s.summary}</p>
                      <ScopeTags scope={s.scope} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <ConversationPrompt className="mt-12" />
      </div>

      <figure className="sticky top-[calc(var(--header-h)+2rem)] col-span-7">
        <div className="relative aspect-[5/4] overflow-hidden bg-dusk">
          {items.map((s, i) => {
            const photo = photos[s.id];
            const shown = i === active;
            return (
              <Image
                key={s.id}
                src={photo.src}
                alt={shown ? photo.alt : ""}
                aria-hidden={shown ? undefined : true}
                fill
                placeholder="blur"
                sizes="(min-width: 1536px) 820px, (min-width: 1024px) 55vw, 1px"
                style={{ objectPosition: photo.focus }}
                className={`object-cover transition-[opacity,transform] duration-[1100ms] ease-out-expo ${
                  shown ? "scale-100 opacity-100" : "scale-[1.04] opacity-0"
                }`}
              />
            );
          })}
        </div>
        <figcaption className="mt-5 flex items-center justify-between gap-6">
          <p className="label flex items-baseline gap-3 text-muted" aria-live="polite">
            <span className="font-display opsz-text text-[1.05rem] italic tracking-normal normal-case text-timber">
              {current.index}
            </span>
            <span>
              {current.title}
              <span className="sr-only">, service {active + 1} of {total}</span>
            </span>
          </p>
          <div className="flex items-center gap-2" aria-hidden="true">
            {items.map((s, i) => (
              <span key={s.id} className="relative h-px w-10 overflow-hidden bg-line-strong">
                <span
                  className={`absolute inset-0 origin-left bg-timber transition-transform duration-700 ease-out-expo ${
                    i === active ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </span>
            ))}
            <span className="label ml-2 text-muted tabular-nums">
              {pad(active + 1)} / {pad(total)}
            </span>
          </div>
        </figcaption>
      </figure>
    </div>
  );
}

/** Phone and tablet: every service in full, each with its photograph. */
function ServiceStack({ items }: { items: readonly Service[] }) {
  return (
    <div className="mt-14 lg:hidden">
      <div className="grid gap-16 sm:gap-20">
        {items.map((s, i) => {
          const photo = photos[s.id];
          return (
            <Reveal key={s.id}>
              <article aria-labelledby={`m-${s.id}`} className="grid gap-7 md:grid-cols-2 md:items-center md:gap-10">
                {/* On tablet the photo alternates sides for an editorial rhythm. */}
                <div className={`relative aspect-[3/2] overflow-hidden bg-dusk md:aspect-[4/5] ${i % 2 ? "md:order-2" : ""}`}>
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    placeholder="blur"
                    sizes="(min-width: 1024px) 1px, (min-width: 768px) 50vw, 100vw"
                    style={{ objectPosition: photo.focus }}
                    className="object-cover"
                  />
                </div>
                <div className="grid gap-5">
                  <p className="flex items-baseline gap-3">
                    <span className="font-display opsz-text text-[1.05rem] italic text-timber">{s.index}</span>
                    <span className="h-px w-8 translate-y-[-0.3em] bg-timber" aria-hidden="true" />
                  </p>
                  <h3 id={`m-${s.id}`} className="font-display text-[clamp(2rem,6vw,2.4rem)] leading-tight">
                    {s.title}
                  </h3>
                  <p className="leading-relaxed text-muted">{s.summary}</p>
                  <ScopeTags scope={s.scope} />
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>
      <ConversationPrompt className="mt-16 border-t border-line-strong pt-10" />
    </div>
  );
}

export function Services() {
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
        <ServiceIndex items={services.items} />
        <ServiceStack items={services.items} />
      </div>
    </section>
  );
}
