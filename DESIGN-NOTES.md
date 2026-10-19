# Design Notes: "Dusk" redesign

Source image: `public/images/house-dusk.jpg` (from "house landing page.png"). A single-storey home at dusk: warm plaster walls, light pouring from the windows, a glowing LED line in the porch canopy, vertical timber slats, a brick pillar, a slate blue evening sky.

The feeling to carry through the site: **the moment the lights come on at home.** Calm, warm, solid, premium without being flashy.

## What was weak before

- No photography. The hero was an abstract line drawing, so the page never showed a home.
- Monospace labels everywhere made it read like a spreadsheet or a technical drawing, cold for a homebuilder.
- One wide sans for every heading gave little contrast between headline and body.
- Lots of thin boxed grids; dark sections were flat black with a graph paper texture.
- Single red accent felt like a warning colour rather than warmth.

## Palette (sampled from the photo, then adjusted for contrast)

| Token | Hex | From the image | Use |
|---|---|---|---|
| `stucco` | `#ECE7DF` | lit plaster wall | main light background |
| `stucco-2` | `#E2DACE` | plaster in shade | alternate light sections |
| `ink` | `#1D1A17` | front door | body text, footer |
| `dusk` | `#1E242C` | evening sky in shadow | dark sections |
| `dusk-2` | `#28303A` | sky, slightly lighter | dark cards |
| `timber` | `#7A4A2C` | timber slats | accent on light (6:1 on stucco) |
| `glow` | `#F2B872` | window and LED light | accent on dark (9:1 on dusk) |
| `brick` | `#8A4532` | brick pillar | small details |
| `haze` | `#A9B4C2` | slate blue sky | secondary text on dark (7:1) |
| `muted` | `#5E5650` | plaster shadow | secondary text on light (5.6:1) |

## Fonts

- **Headings: Bodoni Moda** (variable, with italics). High contrast strokes feel architectural and premium; the italic carries the emphasised phrases ("under one roof.", "not delegated.").
- **Body and labels: Schibsted Grotesk.** Sturdy, very readable, slightly characterful. Used in small caps style (uppercase, tracked) for labels instead of the old monospace.

## Landing page layout

- Full screen hero: the house photo fills the viewport. A dusk gradient rises from the bottom left so the headline sits on the darkest part of the image, next to the lit porch.
- The headline is set large in Bodoni, with "under one roof." in glowing italic and a thin warm light line beneath it, echoing the LED strip in the porch canopy.
- The header floats transparently over the photo, then turns to plaster with dark text once you scroll.
- The stats sit in a plaster band directly under the photo, like a doorstep.
- Dark sections use the dusk colour with a soft pool of warm light at the top (like the porch downlights) and a faint vertical slat texture (like the timber cladding).

## Motion

- Hero photo eases in from a slight zoom; gentle parallax as you scroll away.
- Headline lines rise into place; the light line draws across.
- Sections fade up on scroll; statement words light up as you read.
- Hover: buttons fill with light, links grow an underline, cards lift their light line.
- All movement switches off with "reduce motion" settings. No new animation library (Motion was already installed).

## Rules kept

- No em or en dashes in site text.
- All copy, links, forms and behaviour unchanged.
- Contrast at least 4.5:1 for text, visible focus rings, descriptive alt text that makes no claim the photo shows a Build Studio project.
