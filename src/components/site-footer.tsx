import { contact, nav, site } from "@/lib/content";
import { ArrowUp } from "./icons";
import { Monogram } from "./logo";
import { StartProjectLink } from "./start-project-link";

export function SiteFooter() {
  return (
    <footer className="on-ink relative overflow-hidden bg-ink text-paper">
      <div className="container-x relative grid gap-14 pb-10 pt-20 lg:pt-28">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <Monogram className="h-12 w-12 text-oxide-bright" />
            <p className="font-display mt-8 max-w-[16ch] text-[clamp(2rem,4vw,3.25rem)] font-medium leading-[1.02]">
              Building exceptional homes, under one roof.
            </p>
            <StartProjectLink className="label mt-8 inline-flex items-center gap-3 border-b border-oxide-bright pb-2 text-paper transition-colors hover:text-oxide-bright">
              Start a project
            </StartProjectLink>
          </div>

          <nav aria-label="Footer" className="lg:col-span-2 lg:col-start-8">
            <p className="label mb-5 text-muted-on-ink">Sections</p>
            <ul className="grid gap-3">
              {nav.map((n) => (
                <li key={n.href}>
                  <a href={n.href} className="transition-colors hover:text-oxide-bright">
                    {n.label}
                  </a>
                </li>
              ))}
              <li>
                <a href="#contact" className="transition-colors hover:text-oxide-bright">
                  Contact
                </a>
              </li>
            </ul>
          </nav>

          <div className="lg:col-span-3">
            <p className="label mb-5 text-muted-on-ink">Contact</p>
            <ul className="grid gap-3">
              <li>
                <a href={contact.phoneHref} className="transition-colors hover:text-oxide-bright">
                  {contact.phoneDisplay}
                </a>
              </li>
              <li>
                <a href={`mailto:${contact.email}`} className="transition-colors hover:text-oxide-bright">
                  {contact.email}
                </a>
              </li>
              <li className="text-muted-on-ink">{contact.location}</li>
            </ul>
          </div>
        </div>

        <p
          aria-hidden="true"
          className="font-display min-w-0 select-none overflow-hidden whitespace-nowrap text-[min(10.6vw,9.6rem)] font-semibold uppercase leading-[0.8] tracking-[-0.04em] text-paper/[0.06]"
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
