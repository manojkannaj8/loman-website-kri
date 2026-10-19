"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useState } from "react";
import { contact } from "@/lib/content";
import { ArrowUp, WhatsApp } from "./icons";
import { EASE } from "./motion";

export function FloatingActions() {
  const { scrollY } = useScroll();
  const [showTop, setShowTop] = useState(false);
  useMotionValueEvent(scrollY, "change", (y) => setShowTop(y > window.innerHeight * 0.9));

  return (
    <aside aria-label="Quick contact" className="fixed bottom-4 right-4 z-30 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      <AnimatePresence>
        {showTop ? (
          <motion.a
            href="#top"
            aria-label="Back to top"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="grid h-11 w-11 place-items-center border border-line-strong bg-paper/90 text-ink backdrop-blur transition-colors hover:bg-ink hover:text-paper"
          >
            <ArrowUp size={16} />
          </motion.a>
        ) : null}
      </AnimatePresence>
      <a
        href={contact.whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Message Build Studio on WhatsApp (opens in a new tab)"
        className="group flex h-14 items-center gap-0 overflow-hidden rounded-full bg-[#1f7a4c] pl-4 pr-4 text-white shadow-[0_8px_30px_-10px_rgb(23_24_26/0.5)] transition-[gap,padding,background-color] duration-500 ease-out-expo hover:gap-3 hover:bg-[#186640] hover:pr-6 focus-visible:gap-3 focus-visible:pr-6"
      >
        <WhatsApp size={24} />
        <span className="label max-w-0 overflow-hidden whitespace-nowrap transition-[max-width] duration-500 ease-out-expo group-hover:max-w-40 group-focus-visible:max-w-40">
          WhatsApp
        </span>
      </a>
    </aside>
  );
}
