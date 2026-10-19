"use client";

import { motion } from "motion/react";
import { hero, site } from "@/lib/content";
import { ButtonArrow, buttonClass } from "../button";
import { CountUp } from "../count-up";
import { HeroDrawing } from "../hero-drawing";
import { ArrowRight } from "../icons";
import { EASE } from "../motion";
import { StartProjectLink } from "../start-project-link";

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 1, ease: EASE },
});

export function Hero() {
  return (
    <section id="top" aria-labelledby="hero-title" className="relative overflow-hidden">
      <div className="grid-paper-light pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />

      <div className="container-x relative grid gap-12 pb-12 pt-[calc(var(--header-h)+3rem)] lg:grid-cols-12 lg:gap-8 lg:pb-16 lg:pt-[calc(var(--header-h)+5rem)]">
        <div className="relative z-10 lg:col-span-8 lg:col-start-1 lg:row-start-1 lg:pt-6">
          <motion.p {...rise(0.1)} className="label flex flex-wrap items-center gap-x-3 gap-y-2 text-muted">
            {site.disciplines.map((d, i) => (
              <span key={d} className="inline-flex items-center gap-3">
                {i > 0 ? <span className="h-1 w-1 rotate-45 bg-oxide" aria-hidden="true" /> : null}
                {d}
              </span>
            ))}
          </motion.p>

          <h1
            id="hero-title"
            className="font-display mt-8 text-[clamp(2.4rem,5.4vw,5.1rem)] font-medium leading-[0.98]"
          >
            <span className="block overflow-hidden pb-[0.06em]">
              <motion.span
                className="block"
                initial={{ y: "105%" }}
                animate={{ y: "0%" }}
                transition={{ delay: 0.15, duration: 1.1, ease: EASE }}
              >
                {hero.headline}
              </motion.span>
            </span>
            <span className="block overflow-hidden pb-[0.08em] pt-[0.32em]">
              <motion.span
                className="relative inline-block whitespace-nowrap text-oxide"
                initial={{ y: "120%" }}
                animate={{ y: "0%" }}
                transition={{ delay: 0.28, duration: 1.1, ease: EASE }}
              >
                {/* Roof pitch drawn over the emphasised phrase. */}
                <svg
                  className="absolute -top-[0.26em] left-0 h-[0.26em] w-full overflow-visible"
                  viewBox="0 0 400 26"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <motion.path
                    d="M2 25 L200 2 L398 25"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 1, duration: 1.2, ease: EASE }}
                  />
                </svg>
                {hero.emphasis}
              </motion.span>
            </span>
          </h1>

          <motion.p {...rise(0.5)} className="mt-8 max-w-[44ch] text-[1.125rem] leading-relaxed text-muted">
            {hero.sub}
          </motion.p>

          <motion.div {...rise(0.6)} className="mt-10 flex flex-wrap gap-3">
            <StartProjectLink className={buttonClass("solid")}>
              Start a project
              <ButtonArrow>
                <ArrowRight size={16} />
              </ButtonArrow>
            </StartProjectLink>
            <a href="#services" className={buttonClass("outline")}>
              Our services
            </a>
          </motion.div>
        </div>

        <div className="relative lg:col-span-5 lg:col-start-8 lg:row-start-1 lg:-mr-4 lg:mt-24">
          <HeroDrawing className="mx-auto w-full max-w-[30rem] lg:ml-auto lg:mr-0" />
        </div>
      </div>

      {/* Title block — the stats panel of the drawing sheet. */}
      <div className="container-x relative pb-16 lg:pb-24">
        <motion.dl
          {...rise(0.8)}
          className="grid grid-cols-2 border-l border-t border-line-strong md:grid-cols-4"
        >
          <div className="col-span-2 flex flex-col justify-between gap-6 border-b border-r border-line-strong p-5 md:col-span-1 md:p-6">
            <dt className="label text-muted">Practice</dt>
            <dd className="text-[0.95rem] leading-snug">
              Co. Meath
              <span className="block text-muted">Projects across Leinster</span>
            </dd>
          </div>
          {hero.stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`flex flex-col justify-between gap-6 border-b border-r border-line-strong p-5 md:p-6 ${
                i === 2 ? "col-span-2 md:col-span-1" : ""
              }`}
            >
              <dt className="label order-2 text-muted">{stat.label}</dt>
              <dd className="font-display order-1 text-[clamp(2.4rem,4.4vw,3.6rem)] font-medium leading-none">
                <CountUp value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
              </dd>
            </div>
          ))}
        </motion.dl>
      </div>
    </section>
  );
}
