"use client";

import type { AnchorHTMLAttributes, MouseEvent } from "react";

export const ENQUIRY_ID = "enquiry";
export const ENQUIRY_FIRST_FIELD = "enquiry-name";

/** Scrolls to the enquiry form and moves focus to its first field. */
export function focusEnquiry() {
  const form = document.getElementById(ENQUIRY_ID);
  if (!form) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  form.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  history.replaceState(null, "", `#${ENQUIRY_ID}`);
  window.setTimeout(
    () => document.getElementById(ENQUIRY_FIRST_FIELD)?.focus({ preventScroll: true }),
    reduce ? 0 : 700,
  );
}

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & { onNavigate?: () => void };

export function StartProjectLink({ onNavigate, onClick, children, ...rest }: Props) {
  function handle(e: MouseEvent<HTMLAnchorElement>) {
    onClick?.(e);
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey) return;
    // On other pages (privacy) there is no form: let the link go to the home page.
    if (!document.getElementById(ENQUIRY_ID)) return;
    e.preventDefault();
    onNavigate?.();
    focusEnquiry();
  }
  return (
    <a href={`/#${ENQUIRY_ID}`} onClick={handle} {...rest}>
      {children}
    </a>
  );
}
