"use client";

import { motion } from "motion/react";
import { EASE } from "./motion";

// Small line drawings, one per service. Decorative only.

const line = (delay: number, duration = 0.9) => ({
  initial: { pathLength: 0 },
  animate: { pathLength: 1 },
  transition: { delay, duration, ease: EASE },
});

function Construction() {
  // Timber stud wall elevation with sole/head plates and noggins.
  const studs = [20, 60, 100, 140, 180, 220, 260];
  return (
    <g stroke="currentColor" strokeWidth="1.2" strokeLinecap="square">
      <motion.path d="M10 150H280M10 158H280" {...line(0)} />
      <motion.path d="M10 20H280M10 28H280" {...line(0.1)} />
      {studs.map((x, i) => (
        <motion.path key={x} d={`M${x} 28V150M${x + 8} 28V150`} {...line(0.15 + i * 0.06, 0.7)} />
      ))}
      {studs.slice(0, -1).map((x, i) => (
        <motion.path
          key={`n${x}`}
          d={`M${x + 8} ${i % 2 ? 84 : 92}H${x + 40}`}
          {...line(0.6 + i * 0.05, 0.4)}
          stroke="var(--oxide-bright)"
        />
      ))}
    </g>
  );
}

function ProjectManagement() {
  // Programme bars with a dependency arrow and a today line.
  const bars = [
    { x: 20, w: 80 },
    { x: 70, w: 110 },
    { x: 140, w: 70 },
    { x: 170, w: 100 },
  ];
  return (
    <g strokeLinecap="square">
      {[20, 70, 120, 170, 220, 270].map((x) => (
        <path key={x} d={`M${x} 14V166`} stroke="currentColor" strokeOpacity="0.18" />
      ))}
      {bars.map((b, i) => (
        <motion.rect
          key={i}
          x={b.x}
          y={30 + i * 34}
          height="14"
          width={b.w}
          fill={i === 2 ? "var(--oxide-bright)" : "currentColor"}
          fillOpacity={i === 2 ? 1 : 0.85}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          style={{ transformOrigin: `${b.x}px 0px`, transformBox: "view-box" }}
          transition={{ delay: 0.15 + i * 0.12, duration: 0.8, ease: EASE }}
        />
      ))}
      <motion.path d="M100 44V112H140" stroke="currentColor" fill="none" strokeDasharray="3 3" {...line(0.7, 0.6)} />
      <motion.path d="M205 14V166" stroke="var(--oxide-bright)" strokeWidth="1.2" {...line(0.9, 0.6)} />
    </g>
  );
}

function QuantitySurveying() {
  // Bill of quantities sheet: column rules and measured lines.
  const rows = [42, 62, 82, 102, 122];
  return (
    <g stroke="currentColor" strokeLinecap="square">
      <motion.path d="M20 18H280V162H20Z" strokeWidth="1.2" fill="none" {...line(0)} />
      <motion.path d="M20 32H280" strokeWidth="1.2" {...line(0.2)} />
      {[60, 170, 205, 240].map((x, i) => (
        <motion.path key={x} d={`M${x} 18V162`} strokeOpacity="0.4" {...line(0.25 + i * 0.05, 0.6)} />
      ))}
      {rows.map((y, i) => (
        <motion.g key={y} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 + i * 0.08 }}>
          <path d={`M28 ${y}H48`} strokeOpacity="0.6" />
          <path d={`M68 ${y}H${120 + ((i * 37) % 40)}`} strokeOpacity="0.6" />
          <path d={`M178 ${y}H196M213 ${y}H230M248 ${y}H272`} strokeOpacity="0.6" />
        </motion.g>
      ))}
      <motion.path d="M240 142H272M240 146H272" stroke="var(--oxide-bright)" strokeWidth="1.2" {...line(1, 0.5)} />
    </g>
  );
}

const map = {
  construction: Construction,
  "project-management": ProjectManagement,
  "quantity-surveying": QuantitySurveying,
} as const;

export function ServiceIllustration({ id, className = "" }: { id: string; className?: string }) {
  const Drawing = map[id as keyof typeof map];
  if (!Drawing) return null;
  return (
    <svg viewBox="0 0 300 180" fill="none" className={className} aria-hidden="true" focusable="false">
      <Drawing />
    </svg>
  );
}
