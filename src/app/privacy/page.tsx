import type { Metadata } from "next";
import Link from "next/link";
import { Wordmark } from "@/components/logo";
import { SiteFooter } from "@/components/site-footer";
import { contact, site } from "@/lib/content";

export const metadata: Metadata = {
  title: "Privacy notice",
  description: `How ${site.legalName} handles the information you send through this website.`,
  alternates: { canonical: "/privacy" },
};

/*
  Adapted from the client's live preview, rewritten to match how THIS build
  works: enquiries are emailed via Resend with plans attached (nothing is
  stored on the website), there is no Cloudflare Turnstile, and hosting is
  planned on Vercel. The client should review this before launch.
*/
const sections: { title: string; body: React.ReactNode }[] = [
  {
    title: "Who we are",
    body: (
      <p>
        This website is run by {site.legalName}, registered in Ireland (No. {site.companyNumber}), based in{" "}
        {contact.location}. If you have any questions about your information, email us at{" "}
        <a href={`mailto:${contact.email}`}>{contact.email}</a>.
      </p>
    ),
  },
  {
    title: "What we collect",
    body: (
      <>
        <p>When you send an enquiry through this website, we receive:</p>
        <ul>
          <li>your name, email address and, if you give it, your phone number</li>
          <li>your project type, location and the details you write about it</li>
          <li>any plans (PDF files) you choose to upload</li>
        </ul>
        <p>This website does not use advertising or tracking cookies.</p>
      </>
    ),
  },
  {
    title: "Why we use it",
    body: (
      <p>
        Only to reply to your enquiry, and to prepare a quote or proposal if you ask for one. We never sell your
        information or use it for marketing without asking you first.
      </p>
    ),
  },
  {
    title: "Who else handles it",
    body: (
      <p>
        We use a small number of trusted service providers to run this website: Vercel (website hosting) and Resend
        (delivering enquiry emails, including any plans you attach, to us). They only process your information on our
        behalf. Some of these providers may process data outside the European Economic Area, with the safeguards
        required by EU data protection law.
      </p>
    ),
  },
  {
    title: "How long we keep it",
    body: (
      <p>
        Plans you upload are sent to us as email attachments and are not stored on this website. We keep enquiry
        emails for as long as needed to deal with your enquiry or project, and then delete them.
      </p>
    ),
  },
  {
    title: "Your rights",
    body: (
      <p>
        You can ask us for a copy of the information we hold about you, or ask us to correct or delete it, by emailing{" "}
        <a href={`mailto:${contact.email}`}>{contact.email}</a>. If you&apos;re unhappy with how we handle your
        information, you can contact the Data Protection Commission at{" "}
        <a href="https://www.dataprotection.ie" target="_blank" rel="noopener noreferrer">
          dataprotection.ie
        </a>
        .
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <>
      <header className="border-b border-line">
        <div className="container-x flex h-[var(--header-h)] items-center justify-between">
          <Link href="/" className="-m-2 p-2 text-ink" aria-label="Build Studio home">
            <Wordmark />
          </Link>
          <Link href="/" className="label text-muted transition-colors hover:text-ink">
            Back to site
          </Link>
        </div>
      </header>

      <main id="main" className="container-x py-20 lg:py-28">
        <p className="label text-timber">Privacy</p>
        <h1 className="font-display mt-5 text-[clamp(2.4rem,5vw,4rem)] leading-[1.02]">Privacy notice</h1>
        <p className="mt-4 text-muted">Last updated: October 2026</p>

        <div className="mt-14 grid max-w-[68ch] gap-12 leading-relaxed [&_a]:text-timber [&_a]:underline [&_a]:underline-offset-4 [&_li]:mt-2 [&_p+p]:mt-4 [&_p+ul]:mt-4 [&_ul+p]:mt-4 [&_ul]:list-disc [&_ul]:pl-5">
          {sections.map((s) => (
            <section key={s.title} aria-labelledby={`privacy-${s.title}`}>
              <h2 id={`privacy-${s.title}`} className="font-display mb-4 text-[1.6rem] leading-snug">
                {s.title}
              </h2>
              <div className="text-muted">{s.body}</div>
            </section>
          ))}
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
