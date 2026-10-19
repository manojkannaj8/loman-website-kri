"use client";

import { motion } from "motion/react";
import { EASE } from "./motion";

// Decorative section drawing of a two-storey gable house. It draws itself in
// on load; the roof pitch is picked out in red oxide to echo "under one roof".

const draw = (delay: number, duration = 1.2) => ({
  initial: { pathLength: 0, opacity: 0 },
  animate: { pathLength: 1, opacity: 1 },
  transition: {
    pathLength: { delay, duration, ease: EASE },
    opacity: { delay, duration: 0.01 },
  },
});

const fade = (delay: number) => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { delay, duration: 0.8 },
});

export function HeroDrawing({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 520 560"
      className={className}
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <g stroke="var(--ink)" strokeWidth="1" strokeLinecap="square">
        {/* ground + hatch */}
        <motion.path d="M10 470H510" {...draw(0.1, 1)} strokeWidth="1.4" />
        <motion.g {...fade(0.9)} stroke="var(--line-strong)">
          {Array.from({ length: 25 }, (_, i) => (
            <path key={i} d={`M${20 + i * 20} 476l-12 12`} />
          ))}
        </motion.g>

        {/* external walls */}
        <motion.path d="M90 470V262" {...draw(0.35)} strokeWidth="1.4" />
        <motion.path d="M430 470V262" {...draw(0.35)} strokeWidth="1.4" />
        <motion.path d="M102 470V268" {...draw(0.45)} stroke="var(--line-strong)" />
        <motion.path d="M418 470V268" {...draw(0.45)} stroke="var(--line-strong)" />

        {/* first floor + ceiling */}
        <motion.path d="M102 366H418" {...draw(0.7)} />
        <motion.path d="M102 376H418" {...draw(0.75)} stroke="var(--line-strong)" />
        <motion.path d="M90 262H430" {...draw(0.8)} />

        {/* openings */}
        <motion.path d="M138 470V398H190V470" {...draw(1)} />
        <motion.path d="M250 438V398H372V438Z" {...draw(1.05)} />
        <motion.path d="M311 398V438" {...draw(1.15)} stroke="var(--line-strong)" />
        <motion.path d="M138 334V290H220V334Z" {...draw(1.1)} />
        <motion.path d="M300 334V290H372V334Z" {...draw(1.15)} />
        <motion.path d="M190 470A52 52 0 0 0 138 418" {...draw(1.3, 0.8)} stroke="var(--line-strong)" strokeDasharray="3 4" />

        {/* stair */}
        <motion.path
          d="M222 470V458H234V446H246V434H258V422H270V410H282V398H294V386H306V376"
          {...draw(1.2, 1)}
          stroke="var(--line-strong)"
        />
      </g>

      {/* roof pitch — the accent line */}
      <motion.path
        d="M58 280L260 92L462 280"
        stroke="var(--oxide)"
        strokeWidth="2.2"
        strokeLinecap="square"
        {...draw(0.95, 1.4)}
      />
      <motion.path d="M80 270L260 108L440 270" stroke="var(--oxide)" strokeOpacity="0.35" {...draw(1.15, 1.2)} />

      {/* dimension strings */}
      <g stroke="var(--muted)" strokeWidth="0.8">
        <motion.path d="M488 92V470M482 98l12-12M482 476l12-12M482 268l12-12M482 372l12-12" {...draw(1.6, 1)} />
        <motion.path d="M90 520H430M84 526l12-12M424 526l12-12M254 526l12-12" {...draw(1.7, 1)} />
        <motion.path d="M90 478V530M430 478V530M260 84V64" {...fade(1.9)} strokeDasharray="2 3" />
      </g>

      <motion.g {...fade(2)} fill="var(--muted)" className="font-mono" fontSize="9" letterSpacing="1.4">
        <text x="270" y="72">RIDGE</text>
        <text x="440" y="258">EAVES</text>
        <text x="440" y="362">FFL</text>
        <text x="440" y="464">GL</text>
        <text x="90" y="548">SECTION A—A</text>
        <text x="352" y="548">SHEET A-00</text>
      </motion.g>
    </svg>
  );
}
