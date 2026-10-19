import Link from "next/link";
import { contact, footer, nav, site } from "@/lib/content";
import { ArrowUp } from "./icons";
import { OfficialMark } from "./logo";
import { StartProjectLink } from "./start-project-link";

// Links use "/#section" so the footer also works on other pages (privacy).
export function SiteFooter() {
  return (
    <footer className="on-ink relative overflow-hidden bg-ink text-paper">
      <div className="light-line absolute inset-x-0 top-0 h-px opacity-60" aria-hidden="true" />
      <div className="container-x relative grid gap-14 pb-10 pt-20 lg:pt-28">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <OfficialMark className="h-14 w-auto" />
            <p className="font-display mt-8 max-w-[16ch] text-[clamp(2.2rem,4.4vw,3.6rem)] leading-[1.02]">
              Building exceptional homes, <em className="text-glow">under one roof.</em>
            </p>
            <p className="mt-6 max-w-[40ch] leading-relaxed text-muted-on-ink">{footer.blurb}</p>
            <StartProjectLink className="label mt-8 inline-flex items-center gap-3 border-b border-glow pb-2 text-paper transition-colors hover:text-glow">
              Start a project
            </StartProjectLink>
          </div>

          <nav aria-label="Footer" className="lg:col-span-2 lg:col-start-6">
            <p className="label mb-5 text-muted-on-ink">Sections</p>
            <ul className="grid gap-3">
              {nav.map((n) => (
                <li key={n.href}>
                  <Link href={`/${n.href}`} className="transition-colors hover:text-glow">
                    {n.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/#contact" className="transition-colors hover:text-glow">
                  Contact
                </Link>
              </li>
            </ul>
          </nav>

          <div className="lg:col-span-2">
            <p className="label mb-5 text-muted-on-ink">Get in touch</p>
            <ul className="grid gap-3">
              <li>
                <a href={contact.phoneHref} className="transition-colors hover:text-glow">
                  {contact.phoneDisplay}
                </a>
              </li>
              <li>
                <a href={`mailto:${contact.email}`} className="break-all transition-colors hover:text-glow">
                  {contact.email}
                </a>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-3">
            <p className="label mb-5 text-muted-on-ink">Where we work</p>
            <p className="leading-relaxed">
              {footer.whereWeWork.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </p>
          </div>
        </div>

        <p
          aria-hidden="true"
          className="font-display min-w-0 select-none overflow-hidden whitespace-nowrap text-[min(13.2vw,12rem)] italic leading-[0.85] tracking-[-0.03em] text-paper/[0.07]"
        >
          {site.name}
        </p>

        <div className="flex flex-col gap-4 border-t border-line-on-ink pt-6 text-[0.85rem] text-muted-on-ink lg:flex-row lg:items-center lg:justify-between">
          <p>
            © {site.year} {site.legalName}. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <p>
              Registered in Ireland, No. {site.companyNumber} ·{" "}
              <Link href="/privacy" className="underline underline-offset-4 transition-colors hover:text-paper">
                Privacy
              </Link>
            </p>
            <Link href="/#top" className="label inline-flex items-center gap-2 transition-colors hover:text-paper">
              Back to top <ArrowUp size={14} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
