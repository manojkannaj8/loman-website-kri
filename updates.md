# Project Updates — Build Studio website

_Last updated: 2026-10-19_

## 2026-10-19: "Dusk" visual redesign (branch `redesign/dusk`)

Visual redesign only; content, links, form and behaviour unchanged. Direction and palette are in `DESIGN-NOTES.md`; they **replace** the "drawing set" design notes further down this file.

- Hero is now the full-screen house photo (`public/images/house-dusk.jpg`, from the client's "house landing page.png"), with a dusk gradient, slow zoom-in and gentle parallax.
- Fonts: Bodoni Moda (headings, italics for emphasis) + Schibsted Grotesk (body and labels). Archivo and IBM Plex Mono removed.
- Palette sampled from the photo: plaster, door black, dusk slate, timber, window glow, brick. Tokens in `src/app/globals.css` (`oxide` renamed to `timber`/`glow`; new `dusk`, `dusk-2`, `brick`).
- Dark sections use `.dusk-light` / `.dusk-light-side` (warm light pool + faint timber slats); `.light-line` echoes the porch LED strip.
- Header floats over the photo with light text, turns to plaster on scroll.
- Removed: hero line drawing (`hero-drawing.tsx`), graph paper textures, sheet numbers (A-01...), monospace labels.
- No em/en dashes anywhere in site text.
- Checks: eslint 0, production build OK, no horizontal scroll at 390/820/1440, interactions re-tested, axe clean except the decorative footer watermark, CLS 0, LCP about 2.1 s locally.
- Note: the hero photo is a render supplied by the client; its alt text describes it without claiming it is a Build Studio project.

### Services section with photography (same branch)

- Three client-supplied photos added: `public/images/service-construction.webp` (trades fitting out a kitchen), `service-project-management.webp` (client walkthrough with drawings and model), `service-quantity-surveying.webp` (costing desk: calculator, programme, drawings). Mapping chosen from what each image shows.
- **Desktop (lg+):** editorial split. Left: the service index is now an **accordion** (one service open at a time; click or Enter to open, Up/Down/Home/End move between services). The open service shows its summary and scope tags inline. Right: one sticky 5:4 photo frame that crossfades (with a slight settle from 104% scale) to the open service's photo, with a caption, progress marks and "01 / 03" count beneath.
- **Tablet (md):** each service as a two-column block, portrait 4:5 photo alternating left/right.
- **Phone:** each service stacked: 3:2 photo, index, title, summary, tags.
- Each photo has a `focus` crop point in `services.tsx` used for the tighter desktop and tablet crops.
- Change in behaviour: hovering a service no longer switches it (an accordion that opens on hover makes the list jump under the cursor). Services switch on click/Enter instead.
- Removed `service-illustrations.tsx` (line drawings replaced by photos).
- Only the visible desktop photo carries alt text; hidden ones are `aria-hidden`. The caption announces the current service politely to screen readers.
- Checks: production build OK, eslint 0, no horizontal scroll at 390/820/1440, no console errors, accordion and keyboard focus tested, rest of page regression-tested (filter, start-a-project focus, form validation and submit).

### Logo redraw + opening logo animation (same branch)

- **Logo:** no vector file exists, so the monogram was re-traced from the clearest frame of the original logo in the reference video (6.3 s) and checked side by side against it. It is a squared S wrapping the frame with a B inside: upper-right terminal, top bar, left column, middle bar (shared as the B's waist), a gap, right tab, right column, bottom bar, lower-left terminal; the B has a chamfered notch at its waist. Geometry lives in `MARK` in `src/components/logo.tsx` (64 x 72 grid, stroke 6.75) and is reused by the header, footer, favicon (`src/app/icon.svg`) and share image. Still worth swapping for the official vector when the client supplies it.
- **Intro** (`src/components/intro.tsx`, boot script in `src/lib/intro.ts`, CSS at the end of `globals.css`):
  1. Faint setting-out lines sweep across the screen along the mark's edges.
  2. The S and B are traced as fine pencil lines (SVG `pathLength`), then thicken to full stroke weight.
  3. "BUILD STUDIO" settles in beneath.
  4. The wordmark clears, the mark flies into the header logo position (measured at run time) while the ink overlay lifts; the hero starts its own entrance at the same moment and the header links fade in.
- Plays on every full page load (it originally played once per session, which made it look missing on reload; changed at the client's request). Skipped entirely with "reduce motion". Any key, click, wheel or touch skips straight to the handoff.
- The drawing (steps 1 to 3) is pure CSS on server-rendered markup, so it starts at first paint instead of waiting for JavaScript; `intro.tsx` only runs the handoff, at 2.3 s after first paint or as soon as it hydrates if later.
- No flash or layout shift: an inline script in `layout.tsx` sets `html[data-intro]` to `play` or `skip` before first paint; the overlay only shows in `play`. `scrollbar-gutter: stable` keeps page width identical when scrolling is released. Measured CLS 0.
- Safety: without JavaScript nothing shows; if the intro never hands over, the boot script releases the page after 7 seconds.
- `useIntroReady()` lets components wait for the handoff (used by the hero).
- Dev note: Turbopack sometimes misses edits to `globals.css` (twice this session). If styles look stale, make a small edit to the file again or restart the dev server.

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
