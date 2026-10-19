import type { ReactNode } from "react";

type Variant = "solid" | "outline" | "glow" | "ghost-ink";

const base =
  "group/btn relative inline-flex min-h-12 items-center justify-center gap-3 px-6 py-3 label transition-[background-color,color,border-color,box-shadow] duration-300 select-none cursor-pointer";

const variants: Record<Variant, string> = {
  solid: "bg-ink text-paper hover:bg-timber",
  outline: "border border-line-strong text-ink hover:border-ink hover:bg-ink hover:text-paper",
  // Lamp-light button for dark backgrounds; it warms up on hover.
  glow: "bg-glow text-ink hover:bg-[#f7cb92] hover:shadow-[0_0_0_1px_rgb(242_184_114/0.6),0_10px_40px_-6px_rgb(242_184_114/0.55)]",
  "ghost-ink": "border border-paper/40 text-paper backdrop-blur-[2px] hover:border-paper hover:bg-paper hover:text-ink",
};

export function buttonClass(variant: Variant = "solid", extra = "") {
  return `${base} ${variants[variant]} ${extra}`;
}

/** Arrow that slides across on hover: shared button affordance. */
export function ButtonArrow({ children }: { children: ReactNode }) {
  return (
    <span className="relative inline-flex h-4 w-4 overflow-hidden" aria-hidden="true">
      <span className="absolute inset-0 transition-transform duration-500 ease-out-expo group-hover/btn:translate-x-full">
        {children}
      </span>
      <span className="absolute inset-0 -translate-x-full transition-transform duration-500 ease-out-expo group-hover/btn:translate-x-0">
        {children}
      </span>
    </span>
  );
}
