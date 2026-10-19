"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { contact, nav } from "@/lib/content";
import { ArrowRight, Close } from "./icons";
import { Wordmark } from "./logo";
import { EASE } from "./motion";
import { StartProjectLink } from "./start-project-link";
import { ButtonArrow, buttonClass } from "./button";

const SECTION_IDS = nav.map((n) => n.href.slice(1));

function useActiveSection() {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    const els = SECTION_IDS.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
      },
      // A thin band across the upper-middle of the viewport decides the active section.
      { rootMargin: "-35% 0px -60% 0px" },
    );
    els.forEach((el) => io.observe(el));
    const top = () => window.scrollY < window.innerHeight * 0.5 && setActive(null);
    window.addEventListener("scroll", top, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", top);
    };
  }, []);
  return active;
}

export function SiteHeader() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const active = useActiveSection();
  const menuButton = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  // Over the hero photo the header is see-through with light text.
  const light = !scrolled && !open;

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 24);
    setHidden(y > 480 && y > prev && !open);
  });

  // Mobile menu: lock scroll, close on Escape, keep focus inside.
  useEffect(() => {
    if (!open) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    const first = panel.current?.querySelector<HTMLElement>("a, button");
    first?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
      if (e.key !== "Tab" || !panel.current) return;
      const items = panel.current.querySelectorAll<HTMLElement>("a, button");
      const firstEl = items[0];
      const lastEl = items[items.length - 1];
      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    }
    document.addEventListener("keydown", onKey);
    const button = menuButton.current;
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKey);
      button?.focus();
    };
  }, [open]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const close = () => mq.matches && setOpen(false);
    mq.addEventListener("change", close);
    return () => mq.removeEventListener("change", close);
  }, []);

  return (
    <>
      <a
        href="#main"
        className="label fixed left-4 top-3 z-[60] -translate-y-20 bg-ink px-4 py-3 text-paper focus:translate-y-0"
      >
        Skip to content
      </a>
      <motion.header
        initial={false}
        animate={{ y: hidden ? "-100%" : "0%" }}
        transition={{ duration: 0.45, ease: EASE }}
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500 ${
          scrolled || open
            ? "border-b border-line bg-paper/95 backdrop-blur-md"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <div className="container-x flex h-[var(--header-h)] items-center justify-between gap-6">
          <a href="#top" className={`relative z-10 -m-2 p-2 transition-colors duration-500 ${light ? "text-paper" : "text-ink"}`} aria-label="Build Studio, back to top">
            <Wordmark />
          </a>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {nav.map((item) => {
                const isActive = active === item.href.slice(1);
                return (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      aria-current={isActive ? "true" : undefined}
                      className={`label relative block px-4 py-3 transition-colors duration-300 ${
                        light
                          ? isActive ? "text-paper" : "text-paper/80 hover:text-paper"
                          : isActive ? "text-ink" : "text-muted hover:text-ink"
                      }`}
                    >
                      {item.label}
                      {isActive ? (
                        <motion.span
                          layoutId="nav-active"
                          className={`absolute inset-x-4 bottom-1.5 h-px ${light ? "bg-glow" : "bg-timber"}`}
                          transition={{ duration: 0.5, ease: EASE }}
                        />
                      ) : null}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <StartProjectLink className={buttonClass(light ? "glow" : "solid", "!hidden sm:!inline-flex !min-h-11 !py-2 !px-5")}>
              Start a project
              <ButtonArrow>
                <ArrowRight size={16} />
              </ButtonArrow>
            </StartProjectLink>
            <button
              ref={menuButton}
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className={`relative z-10 grid h-11 w-11 place-items-center border transition-colors duration-500 lg:hidden ${light ? "border-paper/45" : "border-line-strong"}`}
            >
              <span className="relative block h-3 w-5" aria-hidden="true">
                <span
                  className={`absolute left-0 h-px w-5 transition-all ${light ? "bg-paper" : "bg-ink"} duration-300 ${
                    open ? "top-1.5 rotate-45" : "top-0"
                  }`}
                />
                <span
                  className={`absolute left-0 h-px w-5 transition-all ${light ? "bg-paper" : "bg-ink"} duration-300 ${
                    open ? "top-1.5 -rotate-45" : "top-3"
                  }`}
                />
              </span>
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="mobile-menu"
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.6, ease: EASE }}
            className="fixed inset-0 z-40 flex flex-col bg-paper pt-[var(--header-h)] lg:hidden"
          >
            <nav aria-label="Mobile" className="container-x flex-1 overflow-y-auto pt-8">
              <ul className="border-t border-line">
                {nav.map((item, i) => (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + i * 0.05, duration: 0.6, ease: EASE }}
                    className="border-b border-line"
                  >
                    <a
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="font-display flex items-baseline justify-between py-5 text-[2rem] font-medium"
                    >
                      {item.label}
                      <span className="label text-muted">0{i + 1}</span>
                    </a>
                  </motion.li>
                ))}
              </ul>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="mt-10 grid gap-6 pb-10"
              >
                <StartProjectLink onNavigate={() => setOpen(false)} className={buttonClass("solid", "w-full")}>
                  Start a project
                  <ArrowRight size={16} />
                </StartProjectLink>
                <div className="grid gap-2 text-[0.95rem]">
                  <a href={contact.phoneHref} className="w-fit underline-offset-4 hover:underline">
                    {contact.phoneDisplay}
                  </a>
                  <a href={`mailto:${contact.email}`} className="w-fit underline-offset-4 hover:underline">
                    {contact.email}
                  </a>
                  <p className="text-muted">{contact.location}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="label inline-flex w-fit items-center gap-2 text-muted hover:text-ink"
                >
                  <Close size={14} /> Close menu
                </button>
              </motion.div>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
