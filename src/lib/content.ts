// Single source of truth for all site copy. Every string here comes from the
// client's live preview (build-studio-preview.netlify.app): see
// reference-analysis.md before adding anything new.

export const site = {
  name: "Build Studio",
  legalName: "Build Studio Projects Limited",
  companyNumber: "825559",
  description:
    "Build Studio is a construction, project management and quantity surveying practice based in Co. Meath, delivering new builds, renovations, extensions and commercial projects across Leinster.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://buildstudio.ie",
  year: 2026,
  disciplines: ["Construction", "Project Management", "Quantity Surveying"],
} as const;

export const contact = {
  phoneDisplay: "083 114 0783",
  phoneHref: "tel:+353831140783",
  email: "info@buildstudio.ie",
  location: "Enfield, Co. Meath",
  mapsHref: "https://www.google.com/maps/search/?api=1&query=Enfield%2C%20Co.%20Meath",
  whatsappHref:
    "https://wa.me/353831140783?text=Hi%2C%20I%20found%20Build%20Studio%20online%20and%20I%27d%20like%20to%20talk%20about%20a%20project.",
} as const;

export const nav = [
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Experience", href: "#experience" },
  { label: "Why Us", href: "#why" },
] as const;

export const hero = {
  headline: "Building exceptional homes,",
  emphasis: "under one roof.",
  sub: "Founded and led by a quantity surveyor and qualified carpenter. One point of contact for build, programme and cost.",
  stats: [
    { value: 10, prefix: "", suffix: "+", label: "Years in construction" },
    { value: 6, prefix: "", suffix: "", label: "Years as a quantity surveyor" },
    { value: 34, prefix: "€", suffix: "m", label: "Largest project" },
  ],
} as const;

export const about = {
  heading: "The experience behind Build Studio.",
  lead: "Build Studio is led by a qualified quantity surveyor and carpenter with over ten years in the Irish construction industry, six of them as a dedicated quantity surveyor. That time has been spent on the commercial side of live projects: pricing and tendering the work, buying it out, managing costs through the build, and agreeing valuations, variations and final accounts.",
  body: [
    "The projects have ranged from residential and education buildings to civil engineering, demolition and rail infrastructure. Alongside the commercial experience sits a trade background. Being a qualified carpenter means every design and programme is judged by how it will actually be built on site, not just how it looks on paper.",
    "The practice is deliberately small, so you deal with the person pricing, planning and running your job from the first conversation through to handover.",
  ],
  credentials: [
    "BSc Construction Economics",
    "Qualified Carpenter",
    "Estimating, Tendering & Procurement",
    "Site Supervision & Buildability",
  ],
} as const;

export const statement = {
  lead: "Every job is run directly by its founder,",
  emphasis: "not delegated.",
} as const;

export type Service = {
  id: string;
  index: string;
  title: string;
  summary: string;
  scope: readonly string[];
};

export const services = {
  heading: "Three ways to work with us.",
  intro:
    "Engage Build Studio as your main contractor, your project manager, or your independent quantity surveyor, whichever best suits the project.",
  items: [
    {
      id: "construction",
      index: "01",
      title: "Construction",
      summary:
        "Direct delivery from site setup through to handover, with buildability considered from the first read of the drawings rather than discovered on site.",
      scope: ["New Builds", "Renovations", "Extensions", "Commercial Builds", "Commercial Fit-Outs"],
    },
    {
      id: "project-management",
      index: "02",
      title: "Project Management",
      summary:
        "Protecting the design intent and the programme from first fix to completion, for clients engaging trades directly.",
      scope: ["Programme", "Procurement", "Trade Coordination", "Quality Control"],
    },
    {
      id: "quantity-surveying",
      index: "03",
      title: "Quantity Surveying",
      summary:
        "Independent cost advice for private clients, design teams and other contractors, or built into a Build Studio contract.",
      scope: ["Cost Planning", "Tendering", "Valuations", "Final Accounts"],
    },
  ] satisfies Service[],
} as const;

export const buildProcess = {
  eyebrow: "How we build",
  heading: "From plan to finished home.",
  steps: [
    { index: "01", title: "The Plan", body: "Every build starts on paper. Measured, drawn and agreed with you before a single block is laid." },
    { index: "02", title: "The Structure", body: "Walls go up exactly where the drawings say, checked at every stage." },
    { index: "03", title: "The Build", body: "Roof on, finishes in. Managed on site from the first block to the final detail." },
    { index: "04", title: "The Handover", body: "Lights on, keys in your hand. A home that's ready to live in." },
  ],
} as const;

export const experience = {
  heading: "Experience you can rely on.",
  sectors: [
    "Residential",
    "Commercial & Industrial",
    "Education",
    "Civil Engineering",
    "Demolition",
    "Rail Infrastructure",
  ],
  body: [
    "We bring over ten years in the Irish construction industry, including six as a dedicated quantity surveyor, gained working for established main contractors and civil engineering firms.",
    "That experience spans commercial and industrial buildings, education projects, residential developments, civil engineering, demolition and rail infrastructure, on schemes ranging from private projects to multi-million euro contracts. We've been involved at every stage, from estimating and tendering through to valuations, variations and final accounts, and with a qualified carpenter leading the practice, we understand how the work has to be built on site, not just priced on paper.",
    "Build Studio is new, but we're not new to this. We apply the same commercial discipline and attention to detail to every project we take on, large or small.",
  ],
} as const;

export const why = {
  eyebrow: "Why Build Studio",
  // Non-breaking hyphen keeps "trade‑level" on one line.
  heading: "Commercial discipline and trade‑level understanding, at the same table.",
  items: [
    { index: "01", title: "One point of contact", body: "You deal with the person pricing, planning and running the job, from first enquiry to final account." },
    { index: "02", title: "Buildability, read early", body: "Trade-level understanding of detailing and sequencing means issues are caught at tender stage, not mid-build." },
    { index: "03", title: "Commercial control, built in", body: "Measured takeoffs, live supplier pricing and monthly cost reporting, the standard used on multi-million euro schemes, scaled to suit your project." },
    { index: "04", title: "Fully compliant", body: "Fully insured, tax compliant and RCT registered, with RAMS and safety documentation issued before work begins." },
  ],
} as const;

export const contactSection = {
  eyebrow: "Get in touch",
  heading: "Let's talk about your next project.",
  body: "Planning granted, or still at design stage? Whether it's a home, an extension or a commercial build, send us your plans and let's talk it through.",
  formEyebrow: "Start a project",
  formHeading: "Tell us about your project.",
  formIntro: "Share a few details and your plans, and we'll get back to you.",
  privacyNote: "We'll only use your details to reply to your enquiry.",
} as const;

export const footer = {
  blurb: "Building exceptional homes, with construction, project management and quantity surveying under one roof.",
  whereWeWork: ["Based in Enfield, Co. Meath.", "Working on projects across Leinster."],
} as const;

export const projectTypes = [
  "New build",
  "Renovation",
  "Extension",
  "Commercial build / fit-out",
  "Project management",
  "Quantity surveying",
  "Something else",
] as const;
