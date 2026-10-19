import { contact, nav, site } from "@/lib/content";
import { ArrowUp } from "./icons";
import { Monogram } from "./logo";
import { StartProjectLink } from "./start-project-link";

export function SiteFooter() {
  return (
    <footer className="on-ink relative overflow-hidden bg-ink text-paper">
      <div className="light-line absolute inset-x-0 top-0 h-px opacity-60" aria-hidden="true" />
      <div className="container-x relative grid gap-14 pb-10 pt-20 lg:pt-28">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <Monogram className="h-12 w-12 text-glow" />
            <p className="font-display mt-8 max-w-[16ch] text-[clamp(2.2rem,4.4vw,3.6rem)] leading-[1.02]">
              Building exceptional homes, <em className="text-glow">under one roof.</em>
            </p>
            <StartProjectLink className="label mt-8 inline-flex items-center gap-3 border-b border-glow pb-2 text-paper transition-colors hover:text-glow">
              Start a project
            </StartProjectLink>
          </div>

          <nav aria-label="Footer" className="lg:col-span-2 lg:col-start-8">
            <p className="label mb-5 text-muted-on-ink">Sections</p>
            <ul className="grid gap-3">
              {nav.map((n) => (
                <li key={n.href}>
                  <a href={n.href} className="transition-colors hover:text-glow">
                    {n.label}
                  </a>
                </li>
              ))}
              <li>
                <a href="#contact" className="transition-colors hover:text-glow">
                  Contact
                </a>
              </li>
            </ul>
          </nav>

          <div className="lg:col-span-3">
            <p className="label mb-5 text-muted-on-ink">Contact</p>
            <ul className="grid gap-3">
              <li>
                <a href={contact.phoneHref} className="transition-colors hover:text-glow">
                  {contact.phoneDisplay}
                </a>
              </li>
              <li>
                <a href={`mailto:${contact.email}`} className="transition-colors hover:text-glow">
                  {contact.email}
                </a>
              </li>
              <li className="text-muted-on-ink">{contact.location}</li>
            </ul>
          </div>
        </div>

        <p
          aria-hidden="true"
          className="font-display min-w-0 select-none overflow-hidden whitespace-nowrap text-[min(13.2vw,12rem)] italic leading-[0.85] tracking-[-0.03em] text-paper/[0.07]"
        >
          {site.name}
        </p>

        <div className="flex flex-col gap-4 border-t border-line-on-ink pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="label text-muted-on-ink">
            {site.tagline} · © {site.year}
          </p>
          <a href="#top" className="label inline-flex items-center gap-2 text-muted-on-ink transition-colors hover:text-paper">
            Back to top <ArrowUp size={14} />
          </a>
        </div>
      </div>
    </footer>
  );
}
