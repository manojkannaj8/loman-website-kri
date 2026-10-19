"use client";

import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import { experience, formatEuro, type Sector } from "@/lib/content";
import { EASE, Reveal } from "../motion";
import { SectionHeading } from "../section-heading";

type Filter = "All" | Sector;

const max = Math.max(...experience.projects.map((p) => p.value));
// Square-root scale keeps €350k visible next to €34m.
const barWidth = (v: number) => `${Math.max(4, Math.sqrt(v / max) * 100)}%`;

export function Experience() {
  const [filter, setFilter] = useState<Filter>("All");
  const counts = useMemo(() => {
    const c = new Map<Filter, number>([["All", experience.projects.length]]);
    for (const p of experience.projects) c.set(p.sector, (c.get(p.sector) ?? 0) + 1);
    return c;
  }, []);
  const rows = experience.projects.filter((p) => filter === "All" || p.sector === filter);
  const filters: Filter[] = ["All", ...experience.sectors];

  return (
    <section id="experience" aria-labelledby="experience-title" className="py-24 lg:py-36">
      <div className="container-x">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <SectionHeading
            id="experience-title"
            index="03"
            eyebrow="Experience"
            heading={experience.heading}
            intro={experience.intro}
            className="lg:col-span-7"
          />
          <Reveal className="lg:col-span-5" delay={0.1}>
            <fieldset>
              <legend className="label mb-4 text-muted">Filter by sector</legend>
              <div className="flex flex-wrap gap-2">
                {filters.map((f) => {
                  const on = f === filter;
                  return (
                    <button
                      key={f}
                      type="button"
                      aria-pressed={on}
                      onClick={() => setFilter(f)}
                      className={`label inline-flex items-center gap-2 border px-3 py-2.5 transition-colors duration-300 ${
                        on
                          ? "border-ink bg-ink text-paper"
                          : "border-line-strong text-ink hover:border-ink"
                      }`}
                    >
                      {f}
                      <span className={on ? "text-glow" : "text-muted"}>{counts.get(f) ?? 0}</span>
                    </button>
                  );
                })}
              </div>
            </fieldset>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <div className="mt-14 lg:mt-20">
            <table className="w-full border-collapse text-left">
              <caption className="sr-only">
                Projects worked on by Loman Byrne before founding Build Studio
                {filter !== "All" ? `, filtered to ${filter}` : ""}. {rows.length} shown.
              </caption>
              <thead className="max-md:sr-only">
                <tr className="border-b border-ink">
                  <th scope="col" className="label w-[34%] pb-4 font-medium">Project</th>
                  <th scope="col" className="label w-[22%] pb-4 font-medium">Role</th>
                  <th scope="col" className="label pb-4 font-medium">Scope</th>
                  <th scope="col" className="label w-[18%] pb-4 text-right font-medium">Value</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence initial={false} mode="popLayout">
                  {rows.map((p) => (
                    <motion.tr
                      key={p.name}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4, ease: EASE }}
                      className="group border-b border-line max-md:grid max-md:grid-cols-[1fr_auto] max-md:gap-x-4 max-md:gap-y-1 max-md:py-5"
                    >
                      <th scope="row" className="py-6 pr-6 align-top font-normal max-md:p-0">
                        <span className="font-display opsz-text block text-[1.25rem] leading-snug transition-colors duration-300 group-hover:text-timber">
                          {p.name}
                        </span>
                        {p.place ? <span className="mt-1 block text-[0.85rem] text-muted">{p.place}</span> : null}
                      </th>
                      <td className="py-6 pr-6 align-top text-[0.95rem] max-md:order-3 max-md:col-span-2 max-md:p-0 max-md:pt-2">
                        <span className="label mr-2 text-muted md:hidden">Role</span>
                        {p.role}
                      </td>
                      <td className="py-6 pr-6 align-top text-[0.95rem] text-muted max-md:order-4 max-md:col-span-2 max-md:p-0">
                        <span className="label mr-2 md:hidden">Scope</span>
                        {p.scope}
                      </td>
                      <td className="py-6 text-right align-top max-md:order-2 max-md:p-0">
                        <span className="font-display opsz-text block text-[1.25rem] tabular-nums">{formatEuro(p.value)}</span>
                        <span className="ml-auto mt-3 block h-[3px] w-full max-w-[9rem] bg-line max-md:hidden" aria-hidden="true">
                          <motion.span
                            className="block h-full origin-left bg-timber"
                            style={{ width: barWidth(p.value) }}
                            initial={{ scaleX: 0 }}
                            whileInView={{ scaleX: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.2, ease: EASE, delay: 0.1 }}
                          />
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
            <p className="label mt-6 text-muted max-md:hidden">
              Value bars drawn to a square-root scale
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
