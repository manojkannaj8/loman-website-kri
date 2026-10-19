"use client";

import Image, { type StaticImageData } from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { services, type Service } from "@/lib/content";
import { ArrowRight } from "../icons";
import { EASE, Reveal } from "../motion";
import { SectionHeading } from "../section-heading";
import { StartProjectLink } from "../start-project-link";
import constructionPhoto from "../../../public/images/service-construction.webp";
import pmPhoto from "../../../public/images/service-project-management.webp";
import qsPhoto from "../../../public/images/service-quantity-surveying.webp";

/*
  Services as three editorial spreads. Each photograph is shown whole at its
  native 3:2 ratio (no cropping, no zoom) and never wider than the 1536 px
  source can serve sharply on a high-density screen. Images are encoded at
  quality 92 (allowed in next.config.ts) instead of the default 75.
*/

const PHOTO_QUALITY = 92;

const photos: Record<string, { src: StaticImageData; alt: string }> = {
  construction: {
    src: constructionPhoto,
    alt: "Tradespeople fitting out an open plan kitchen and living space, with drawings, a hard hat and stone samples on a table in the foreground",
  },
  "project-management": {
    src: pmPhoto,
    alt: "A client and two members of the project team reviewing drawings beside a scale model, in a home under construction overlooking the coast",
  },
  "quantity-surveying": {
    src: qsPhoto,
    alt: "A desk set up for costing, with a calculator, a programme open on a laptop, drawings, a measuring rule and a scale model",
  },
};

const total = String(services.items.length).padStart(2, "0");

function Spread({ service, flip }: { service: Service; flip: boolean }) {
  const photo = photos[service.id];
  const reduce = useReducedMotion();
  // The photograph is uncovered from the side nearest the text, like a blind lifting.
  const hidden = flip ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)";

  return (
    <article
      aria-labelledby={`service-${service.id}`}
      className="grid items-center gap-y-9 lg:grid-cols-12 lg:gap-x-12"
    >
      <figure className={`lg:col-span-7 ${flip ? "lg:order-2 lg:col-start-6" : ""}`}>
        <motion.div
          className="relative -mx-5 aspect-[3/2] overflow-hidden bg-dusk sm:mx-0"
          initial={{ clipPath: hidden }}
          whileInView={{ clipPath: "inset(0 0% 0 0%)" }}
          viewport={{ once: true, margin: "0px 0px -15% 0px" }}
          transition={{ duration: reduce ? 0 : 1.3, ease: EASE }}
        >
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            quality={PHOTO_QUALITY}
            placeholder="blur"
            // Never asks for more than the source has; caps the frame at about 760 px on desktop.
            sizes="(min-width: 1536px) 760px, (min-width: 1024px) 54vw, 100vw"
            className="object-cover"
          />
        </motion.div>
        <figcaption className="mt-4 flex items-center justify-between gap-4">
          <span className="label text-muted">{service.title}</span>
          <span className="label tabular-nums text-muted">
            {service.index} / {total}
          </span>
        </figcaption>
      </figure>

      <div className={`lg:col-span-4 ${flip ? "lg:order-1 lg:col-start-1" : "lg:col-start-9"}`}>
        <Reveal>
          <p className="flex items-center gap-4">
            <span className="font-display text-[clamp(3rem,5vw,4.5rem)] italic leading-none text-timber">
              {service.index}
            </span>
            <span className="h-px flex-1 bg-line-strong" aria-hidden="true" />
          </p>
        </Reveal>
        <Reveal delay={0.06}>
          <h3
            id={`service-${service.id}`}
            className="font-display mt-6 text-[clamp(2.1rem,3.4vw,3.1rem)] leading-[1.04]"
          >
            {service.title}
          </h3>
        </Reveal>
        <Reveal delay={0.12}>
          <p className="mt-5 text-[1.0625rem] leading-relaxed text-muted">{service.summary}</p>
        </Reveal>
        <Reveal delay={0.18}>
          <div className="mt-8">
            <p className="label mb-3 text-ink">Scope</p>
            <ul className="grid border-t border-line-strong min-[420px]:grid-cols-2" aria-label={`${service.title} scope`}>
              {service.scope.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2.5 border-b border-line py-3 pr-3 text-[0.95rem] leading-snug"
                >
                  <span className="h-px w-3 shrink-0 bg-timber" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </article>
  );
}

export function Services() {
  return (
    <section id="services" aria-labelledby="services-title" className="bg-paper-2 py-24 lg:py-36">
      <div className="container-x">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <SectionHeading
            id="services-title"
            index="02"
            eyebrow="Services"
            heading={services.heading}
            intro={services.intro}
            className="lg:col-span-7"
          />
          <Reveal className="lg:col-span-4 lg:col-start-9" delay={0.1}>
            <div className="grid gap-4 border-l-2 border-timber pl-6">
              <p className="leading-relaxed text-muted">
                Not sure which suits your project? Describe it and Loman will advise.
              </p>
              <StartProjectLink className="label inline-flex w-fit items-center gap-3 border-b border-timber pb-2 text-ink transition-colors hover:text-timber">
                Start a conversation
                <ArrowRight size={14} />
              </StartProjectLink>
            </div>
          </Reveal>
        </div>

        <div className="mt-20 grid gap-24 sm:gap-28 lg:mt-28 lg:gap-40">
          {services.items.map((service, i) => (
            <Spread key={service.id} service={service} flip={i % 2 === 1} />
          ))}
        </div>
      </div>
    </section>
  );
}
