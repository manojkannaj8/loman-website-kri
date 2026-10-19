import { contact, contactSection } from "@/lib/content";
import { EnquiryForm } from "../enquiry-form";
import { ArrowUpRight, Mail, Phone, Pin, WhatsApp } from "../icons";
import { Reveal } from "../motion";
import { SectionHeading } from "../section-heading";

const channels = [
  { label: "Phone", value: contact.phoneDisplay, href: contact.phoneHref, Icon: Phone },
  { label: "Email", value: contact.email, href: `mailto:${contact.email}`, Icon: Mail },
  { label: "WhatsApp", value: "Message Loman", href: contact.whatsappHref, Icon: WhatsApp, external: true },
  { label: "Based in", value: contact.location, href: contact.mapsHref, Icon: Pin, external: true },
];

export function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="bg-paper-2 py-24 lg:py-36">
      <div className="container-x grid gap-14 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-[calc(var(--header-h)+2.5rem)]">
            <SectionHeading
              id="contact-title"
              index="05"
              eyebrow={contactSection.eyebrow}
              heading={contactSection.heading}
              intro={contactSection.body}
            />
            <Reveal delay={0.15}>
              <ul className="mt-12 border-t border-line-strong">
                {channels.map(({ label, value, href, Icon, external }) => (
                  <li key={label} className="border-b border-line-strong">
                    <a
                      href={href}
                      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="group grid grid-cols-[2.5rem_1fr_auto] items-center gap-2 py-5 transition-colors duration-300 hover:text-timber"
                    >
                      <Icon size={18} className="text-muted transition-colors duration-300 group-hover:text-timber" />
                      <span className="grid gap-1">
                        <span className="label text-muted">{label}</span>
                        <span className="text-[1.05rem]">{value}</span>
                      </span>
                      <ArrowUpRight
                        size={18}
                        className="transition-transform duration-500 ease-out-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      />
                      {external ? <span className="sr-only">(opens in a new tab)</span> : null}
                    </a>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>

        <Reveal className="lg:col-span-7" delay={0.1}>
          <EnquiryForm />
        </Reveal>
      </div>
    </section>
  );
}
