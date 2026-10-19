"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { hero, site } from "@/lib/content";
import { ButtonArrow, buttonClass } from "../button";
import { CountUp } from "../count-up";
import { ArrowRight } from "../icons";
import { useIntroReady } from "../intro";
import { EASE } from "../motion";
import { StartProjectLink } from "../start-project-link";
import housePhoto from "../../../public/images/house-dusk.jpg";

// Entrance animations hold until the logo intro hands over (immediately when it is skipped).
const rise = (ready: boolean, delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 },
  transition: { delay, duration: 1, ease: EASE },
});

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const ready = useIntroReady();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  // Gentle parallax: the photo drifts slower than the page.
  const photoY = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["0%", "16%"]);
  const copyY = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["0%", "-10%"]);

  return (
    <section id="top" aria-labelledby="hero-title">
      <div ref={ref} className="on-ink relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden bg-dusk text-paper">
        <motion.div style={{ y: photoY }} className="absolute inset-0 -z-20">
          <motion.div
            className="absolute inset-0"
            initial={{ scale: 1.08 }}
            animate={{ scale: ready ? 1 : 1.08 }}
            transition={{ duration: 2.6, ease: EASE }}
          >
            <Image
              src={housePhoto}
              alt="A modern single storey home at dusk, with warm light in the windows, timber slat cladding, a brick porch pillar and a lit canopy over the front door"
              fill
              priority
              placeholder="blur"
              sizes="100vw"
              className="object-cover object-[52%_50%]"
            />
          </motion.div>
        </motion.div>

        {/* Dusk falls from the bottom left so the words sit on the darkest part of the photo. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgb(20_18_16/0.94)_0%,rgb(20_18_16/0.7)_30%,rgb(20_18_16/0.15)_62%,rgb(20_18_16/0)_75%),linear-gradient(to_bottom,rgb(22_28_36/0.6)_0%,rgb(22_28_36/0)_22%)] lg:bg-[linear-gradient(to_top,rgb(20_18_16/0.9)_0%,rgb(20_18_16/0.45)_32%,rgb(20_18_16/0)_60%),linear-gradient(to_right,rgb(22_28_36/0.82)_0%,rgb(22_28_36/0.55)_45%,rgb(22_28_36/0.12)_70%,rgb(22_28_36/0)_80%),linear-gradient(to_bottom,rgb(22_28_36/0.55)_0%,rgb(22_28_36/0)_20%)]"
        />

        <motion.div style={{ y: copyY }} className="container-x relative pb-14 pt-[calc(var(--header-h)+4rem)] sm:pb-20 lg:pb-24">
          <motion.p {...rise(ready, 0.2)} className="label flex flex-wrap items-center gap-x-4 gap-y-2 text-paper/85">
            {site.disciplines.map((d, i) => (
              <span key={d} className="inline-flex items-center gap-4">
                {i > 0 ? <span className="h-3 w-px bg-glow/70" aria-hidden="true" /> : null}
                {d}
              </span>
            ))}
          </motion.p>

          <h1
            id="hero-title"
            className="font-display mt-6 max-w-[15ch] text-[clamp(2.75rem,7.2vw,6.6rem)] leading-[0.98] text-paper"
          >
            <span className="block overflow-hidden pb-[0.06em]">
              <motion.span
                className="block"
                initial={{ y: "105%" }}
                animate={{ y: ready ? "0%" : "105%" }}
                transition={{ delay: 0.25, duration: 1.2, ease: EASE }}
              >
                {hero.headline}
              </motion.span>
            </span>
            <span className="block overflow-hidden pb-[0.18em]">
              <motion.em
                className="relative inline-block whitespace-nowrap pr-[0.08em] text-glow"
                initial={{ y: "115%" }}
                animate={{ y: ready ? "0%" : "115%" }}
                transition={{ delay: 0.4, duration: 1.2, ease: EASE }}
              >
                {hero.emphasis}
                {/* A strip of light, like the LED line in the porch canopy. */}
                <motion.span
                  aria-hidden="true"
                  className="light-line absolute -bottom-[0.06em] left-0 h-[2px] w-full origin-left"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: ready ? 1 : 0 }}
                  transition={{ delay: 1.2, duration: 1.4, ease: EASE }}
                />
              </motion.em>
            </span>
          </h1>

          <div className="mt-8 grid gap-8 lg:mt-10 lg:grid-cols-[minmax(0,34rem)_auto] lg:items-end lg:justify-between">
            <motion.p {...rise(ready, 0.65)} className="max-w-[40ch] text-[1.125rem] leading-relaxed text-paper/85 sm:text-[1.2rem]">
              {hero.sub}
            </motion.p>

            <motion.div {...rise(ready, 0.8)} className="flex flex-wrap gap-3">
              <StartProjectLink className={buttonClass("glow")}>
                Start a project
                <ButtonArrow>
                  <ArrowRight size={16} />
                </ButtonArrow>
              </StartProjectLink>
              <a href="#services" className={buttonClass("ghost-ink")}>
                Our services
              </a>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Stats on a plaster band, the doorstep beneath the photo. */}
      <div className="border-b border-line bg-paper">
        <motion.dl {...rise(ready, 0.9)} className="container-x grid grid-cols-2 lg:grid-cols-4">
          <div className="col-span-2 flex flex-col justify-center gap-1 border-b border-line py-7 lg:col-span-1 lg:border-b-0 lg:border-r lg:py-10 lg:pr-8">
            <dt className="label text-timber">The practice</dt>
            <dd className="text-[1.05rem] leading-snug">
              Co. Meath, <span className="text-muted">working across Leinster</span>
            </dd>
          </div>
          {hero.stats.map((stat, i) => {
            const cell = [
              "border-r border-line pr-5 lg:pr-8",
              "pl-5 lg:border-r lg:border-line lg:pr-8",
              "col-span-2 border-t border-line lg:col-span-1 lg:border-t-0",
            ][i];
            return (
              <div key={stat.label} className={`flex flex-col-reverse justify-end gap-3 py-7 lg:py-10 lg:pl-8 ${cell}`}>
                <dt className="label text-muted">{stat.label}</dt>
                <dd className="font-display opsz-text text-[clamp(2.6rem,4.6vw,3.9rem)] leading-none tracking-[-0.02em]">
                  <CountUp value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                </dd>
              </div>
            );
          })}
        </motion.dl>
      </div>
    </section>
  );
}
