import type { ReactNode } from "react";

type Variant = "solid" | "outline" | "oxide" | "ghost-ink";

const base =
  "group/btn relative inline-flex items-center justify-center gap-3 overflow-hidden px-6 h-12 label !text-[0.72rem] font-medium transition-colors duration-300 select-none";

const variants: Record<Variant, string> = {
  solid: "bg-ink text-paper hover:bg-oxide",
  oxide: "bg-oxide text-paper hover:bg-ink",
  outline: "border border-line-strong text-ink hover:border-ink hover:bg-ink hover:text-paper",
  "ghost-ink": "border border-line-on-ink text-paper hover:border-paper hover:bg-paper hover:text-ink",
};

export function buttonClass(variant: Variant = "solid", extra = "") {
  return `${base} ${variants[variant]} ${extra}`;
}

/** Arrow that slides across on hover — shared button affordance. */
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
