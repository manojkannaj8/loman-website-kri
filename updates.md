# Project Updates — Build Studio website

_Last updated: 2026-10-19_

Read this file and `reference-analysis.md` at the start of every session, then inspect the code before continuing.

## Status

Single-page marketing site for Build Studio (Loman Byrne, Co. Meath) — **implemented and running locally**. All content from the reference video is in place. Email delivery for the enquiry form needs a Resend API key before launch (see Known issues).

## Stack

| Concern | Choice | Why |
|---|---|---|
| Framework | Next.js 16.4 (App Router, Turbopack, `cacheComponents` on) | Same family as the reference build; static shell + route handler for the form. |
| Language | TypeScript, React 19 | |
| Styling | Tailwind CSS v4 with CSS-variable design tokens in `src/app/globals.css` | Utility speed with a single token source. |
| Motion | `motion` 12 (`motion/react`) | Scroll reveals, path drawing, layout animations; `MotionConfig reducedMotion="user"`. |
| Fonts | Archivo (variable, `wdth` axis) + IBM Plex Mono via `next/font` | Expanded Archivo for display, normal width for body; mono for drawing-sheet labels. |
| Email | Resend REST API via `fetch` (no SDK dependency) | Optional — configured by env vars. |

## Architecture

```
src/
  app/
    layout.tsx            fonts, metadata, viewport
    page.tsx              composes sections + JSON-LD (GeneralContractor)
    globals.css           tokens, utilities (.font-display, .label, .container-x, grids)
    api/enquiry/route.ts  POST multipart → validate → Resend (or log in dev)
    sitemap.ts, robots.ts, icon.svg, opengraph-image.tsx
  lib/
    content.ts            ALL copy and data (single source of truth)
    enquiry.ts            shared client/server validation + plan limits
  components/
    site-header.tsx       sticky header, hide-on-scroll, active-section underline, mobile menu dialog
    site-footer.tsx
    floating-actions.tsx  WhatsApp pill + back-to-top
    enquiry-form.tsx      full form, drag-and-drop PDF plans, states, fallbacks
    hero-drawing.tsx      self-drawing house section SVG
    service-illustrations.tsx
    count-up.tsx, motion.tsx (Reveal, MotionProvider), section-heading.tsx,
    button.tsx, icons.tsx, logo.tsx, start-project-link.tsx
    sections/             hero, about, statement, services, experience, why, contact
public/images/loman-byrne.jpg   founder photo (low-res crop from video — replace)
```

## Design direction

"Drawing set": the site reads like a sheet set from a construction drawing package.

- **Palette:** limestone paper `#f1eee8`, charcoal ink `#17181a`, one accent — red-oxide primer `#a63d24` (`#e07a5c` on dark). All text pairs pass WCAG AA.
- **Type:** Archivo expanded (`wdth` 118) for headings, Archivo 100 for body, IBM Plex Mono uppercase for labels and sheet references (A-00 … A-06).
- **Motifs:** hairline borders, title-block stats panel, drafting grid backgrounds, dimension strings, roof-pitch line over "under one roof."
- **Motion:** hero section drawing draws itself; headline lines rise from masks; stats count up; statement words light up with scroll; services panel swaps with crossfade and a sliding indicator; experience rows re-flow when filtered and value bars grow; hover lines on Why items. All respect `prefers-reduced-motion`.
- Deliberately different from the reference (which used dark/cream, Lora serif, gold, centred hero, expanding cards).

## Completed

- [x] Reference analysis (`reference-analysis.md`) from 52 frames + dense frames of the modal
- [x] Project scaffold, tokens, fonts, metadata, sitemap, robots, icon, OG image, JSON-LD
- [x] Header (desktop nav with active section, mobile full-screen menu with focus trap + Esc)
- [x] Hero, About + founder card, Statement band, Services (tabs on desktop / stacked on mobile), Experience (filterable table / cards on mobile), Why, Contact, Footer
- [x] Enquiry form: all reference fields, PDF-only plans (≤5 × 20 MB) with drag & drop, inline validation, honeypot, success/error states, mailto + WhatsApp fallback
- [x] "Start a project" buttons scroll to the form and focus the Name field
- [x] WhatsApp floating button with the reference's pre-filled message; back-to-top

## Testing results (2026-10-19)

Browser checks used headless Chrome driven by Playwright (`playwright-core`, kept in the session scratchpad, not a project dependency), because the desktop app's browser pane was hidden and couldn't take screenshots.

| Check | Result |
|---|---|
| `tsc --noEmit`, `eslint src` | Pass, 0 problems |
| `npm run build` | Pass. `/`, `/robots.txt`, `/sitemap.xml`, `/opengraph-image`, `/icon.svg` static; `/api/enquiry` dynamic |
| Layout at 1440×900, 820×1180, 390×844 | All sections render, no horizontal scroll, no console errors |
| Service tabs (click, hover, arrow keys) | Pass — `aria-selected` follows, panels and illustrations swap |
| Experience filter | Rail → 2 rows, All → 11 rows |
| "Start a project" (header) | Scrolls to form, focus lands on Name, URL `#enquiry` |
| Empty submit | 4 required fields flagged with `aria-invalid`, focus moves to first |
| Non-PDF upload | Rejected: "notes.txt isn't a PDF." PDF accepted and listed |
| Valid submit (dev, no API key) | 200, server logs enquiry, success panel shown |
| API with bad data | 422 with per-field errors |
| Mobile menu | Opens, focus moves inside, Esc closes, link navigates and closes |
| Reduced motion | Statement words fully visible (opacity 1); transforms disabled via `MotionConfig` |
| axe-core (WCAG 2.1 AA + best practice) | 0 violations except decorative, `aria-hidden` footer watermark (intentionally faint) |
| Production perf, mobile viewport, localhost | TTFB ≈ 30 ms, FCP ≈ 0.3 s, LCP ≈ 2.1 s, CLS 0; ~190 KB JS transferred |

Fixed during testing: hero headline too large/roof line dashing; footer wordmark pushing the contact column off-screen; "trade-level" wrapping at the hyphen; empty column under service tabs (added a CTA); low-contrast inactive tabs and header nav; floating actions outside a landmark; soft founder photo on tablet (card width capped); no visible focus on the file dropzone.

Not tested: real email delivery (no Resend key), Safari/Firefox, physical touch devices, real screen readers.

## Known issues / limitations

- **Founder photo is a ~340×255 crop from the screen recording.** Replace `public/images/loman-byrne.jpg` with the original (≥1200 px wide).
- **Logo is a redrawn approximation** of the interlocking monogram (`src/components/logo.tsx`, `src/app/icon.svg`). Replace with the official vector.
- **Email delivery needs `RESEND_API_KEY`** (and a verified `ENQUIRY_FROM` domain). Without it: dev logs the enquiry and shows a "not connected" success; production returns 503 and the form shows email/WhatsApp fallbacks. See `.env.example`.
- Plans upload: 5 × 20 MB can reach 100 MB. Serverless hosts cap request bodies (Vercel ≈ 4.5 MB). For large uploads, self-host on Node or move uploads to direct-to-storage (e.g. S3/R2 presigned URLs).
- Project-type options were not visible in the video; they mirror the service list.
- Projects are grouped into sectors (for the filter) by their stated scope; the video does not show this grouping.
- No privacy policy / cookie notice — none in the reference, and the site sets no cookies or analytics.
- The reference opened the enquiry form in a modal; here it sits inline in the Contact section and every "Start a project" button scrolls to it and focuses the first field (no hidden dialog to manage). A `<noscript>` rule in `layout.tsx` keeps animated content visible with JavaScript disabled (verified).
- LCP (~2.1 s) is set by the hero's entrance animation; showing the hero sub-copy without a fade would lower it if needed.
- Tooling: the 21st.dev MCP and design skills were available but not used — the design system was defined directly. Video frames were extracted with a scratchpad copy of `ffmpeg-static`.

## Next steps

1. Get the original founder photo and vector logo from the client.
2. Create a Resend account, verify `buildstudio.ie`, set env vars, send a real test enquiry with a PDF.
3. Decide hosting (Node host recommended for large plan uploads).
4. Add a privacy notice covering enquiry data (GDPR) before launch.
