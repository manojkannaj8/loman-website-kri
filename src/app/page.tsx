import { FloatingActions } from "@/components/floating-actions";
import { IntroProvider } from "@/components/intro";
import { MotionProvider } from "@/components/motion";
import { About } from "@/components/sections/about";
import { Contact } from "@/components/sections/contact";
import { Experience } from "@/components/sections/experience";
import { Hero } from "@/components/sections/hero";
import { Process } from "@/components/sections/process";
import { Services } from "@/components/sections/services";
import { Statement } from "@/components/sections/statement";
import { Why } from "@/components/sections/why";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { contact, site } from "@/lib/content";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "GeneralContractor",
  name: site.name,
  legalName: site.legalName,
  description: site.description,
  url: site.url,
  telephone: "+353831140783",
  email: contact.email,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Enfield",
    addressRegion: "Co. Meath",
    addressCountry: "IE",
  },
  areaServed: "Leinster",
};

export default function Home() {
  return (
    <MotionProvider>
      <IntroProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
        <SiteHeader />
        <main id="main" tabIndex={-1} className="outline-none">
          <Hero />
          <About />
          <Statement />
          <Services />
          <Process />
          <Experience />
          <Why />
          <Contact />
        </main>
        <SiteFooter />
        <FloatingActions />
      </IntroProvider>
    </MotionProvider>
  );
}
