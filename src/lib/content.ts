// Single source of truth for all site copy. Every string here comes from the
// reference video: see reference-analysis.md before adding anything new.

export const site = {
  name: "Build Studio",
  tagline: "Building Exceptional Homes",
  description:
    "Build Studio is an Irish construction practice in Co. Meath delivering new builds, renovations, extensions, commercial builds and fit-outs, with project management and quantity surveying. Founded and led by quantity surveyor and qualified carpenter Loman Byrne.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://buildstudio.ie",
  year: 2026,
  disciplines: ["Construction", "Project Management", "Quantity Surveying"],
} as const;

export const contact = {
  phoneDisplay: "083 114 0783",
  phoneHref: "tel:+353831140783",
  email: "info@buildstudio.ie",
  location: "Rathcore, Enfield, Co. Meath",
  mapsHref:
    "https://www.google.com/maps/search/?api=1&query=Rathcore%2C%20Enfield%2C%20Co.%20Meath",
  whatsappHref:
    "https://wa.me/353831140783?text=Hi%20Loman%2C%20I%20found%20Build%20Studio%20online%20and%20I%27d%20like%20to%20talk%20about%20a%20project.",
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
    { value: 34, prefix: "€", suffix: "m", label: "Largest scheme delivered" },
  ],
} as const;

export const about = {
  heading: "A new practice with a decade of experience behind it.",
  intro:
    "Build Studio is a new Irish construction practice delivering new builds, renovations, extensions, commercial builds and fit-outs to a consistently high standard, alongside professional project management and quantity surveying.",
  focus: "It is built deliberately around a small number of projects at a time.",
  promise: "Every job is run directly by its founder, not delegated.",
  base: "Based in Co. Meath, working on projects across Leinster.",
  founder: {
    name: "Loman Byrne",
    title: "Quantity Surveyor & Qualified Carpenter",
    bio: "Over ten years in Irish construction, six as a dedicated quantity surveyor across residential, civil engineering, demolition and rail infrastructure. From the tools to the cost plan: one point of contact who understands both sides of a project.",
    credentials: [
      "BSc Construction Economics, ATU Sligo",
      "Qualified Carpenter, SOLAS",
      "Estimating, Tendering & Procurement",
      "Site Supervision & Buildability",
    ],
  },
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

// Sector is a grouping derived from each project's stated scope, using the
// sectors named in the founder bio. Values are in euro.
export type Sector = "Residential" | "Civil engineering" | "Rail" | "Demolition" | "Education";

export type Project = {
  name: string;
  place?: string;
  role: string;
  scope: string;
  value: number;
  sector: Sector;
};

export const experience = {
  heading: "Project experience.",
  intro:
    "Experience gained by Loman Byrne before founding Build Studio, in roles at Breffni Group, Quanmac Ltd and E.P. Lynam.",
  sectors: ["Residential", "Civil engineering", "Rail", "Demolition", "Education"] as Sector[],
  projects: [
    { name: "HazelBrooke", place: "Malahide, Co. Dublin", role: "Senior Quantity Surveyor", scope: "A-rated residential development", value: 34_000_000, sector: "Residential" },
    { name: "Ashwood Hall", place: "Malahide, Co. Dublin", role: "Senior Contracts Manager", scope: "A-rated residential development", value: 21_000_000, sector: "Residential" },
    { name: "Brookefield", role: "Junior Quantity Surveyor", scope: "A-rated residential development", value: 15_000_000, sector: "Residential" },
    { name: "DCC Waste Removal", place: "Dublin City Council", role: "Senior Quantity Surveyor", scope: "6m deep foul drainage & road upgrade works", value: 13_000_000, sector: "Civil engineering" },
    { name: "Momentum Logistics Park", place: "Naas, Co. Kildare", role: "Senior Quantity Surveyor", scope: "Civils & public works", value: 8_000_000, sector: "Civil engineering" },
    { name: "Irish Rail Birdhill-Limerick", place: "Track relaying project", role: "Senior Quantity Surveyor", scope: "Track relaying, demolition & refurbishment", value: 2_000_000, sector: "Rail" },
    { name: "Beacon Hospital", place: "Sandyford, Dublin 18", role: "Senior Quantity Surveyor", scope: "Controlled demolition of 8-storey building", value: 1_600_000, sector: "Demolition" },
    { name: "Pre-Education Building", place: "Enfield, Co. Meath", role: "Senior QS & Project Manager", scope: "New-build education facility", value: 725_000, sector: "Education" },
    { name: "One-off Private Dwelling", role: "Senior QS & Project Manager", scope: "A-rated family home", value: 670_000, sector: "Residential" },
    { name: "Irish Rail Broadmeadow", place: "Donabate, Co. Dublin", role: "Senior Quantity Surveyor", scope: "Rail infrastructure works", value: 650_000, sector: "Rail" },
    { name: "Waste Water Treatment Plant", place: "Enfield, Co. Meath", role: "Senior Quantity Surveyor", scope: "8m deep excavation & sheet piling", value: 350_000, sector: "Civil engineering" },
  ] satisfies Project[],
};

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
  body: "Whether it's a new home, an extension or a QS appointment, send your details and plans and Loman will be in touch.",
  formEyebrow: "Start a project",
  formHeading: "Tell us about your project.",
  formIntro: "Share a few details and your plans, and Loman will get back to you.",
} as const;

// Options are not visible in the reference; they mirror the service list above.
export const projectTypes = [
  "New build",
  "Renovation",
  "Extension",
  "Commercial build",
  "Commercial fit-out",
  "Project management",
  "Quantity surveying",
  "Other",
] as const;

export function formatEuro(value: number) {
  if (value >= 1_000_000) return `€${(value / 1_000_000).toFixed(1)}m`;
  return `€${Math.round(value / 1000)}k`;
}
