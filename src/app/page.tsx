import { FloatingActions } from "@/components/floating-actions";
import { MotionProvider } from "@/components/motion";
import { About } from "@/components/sections/about";
import { Contact } from "@/components/sections/contact";
import { Experience } from "@/components/sections/experience";
import { Hero } from "@/components/sections/hero";
import { Services } from "@/components/sections/services";
import { Statement } from "@/components/sections/statement";
import { Why } from "@/components/sections/why";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { about, contact, site } from "@/lib/content";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "GeneralContractor",
  name: site.name,
  description: site.description,
  url: site.url,
  telephone: "+353831140783",
  email: contact.email,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Rathcore, Enfield",
    addressRegion: "Co. Meath",
    addressCountry: "IE",
  },
  areaServed: "Leinster",
  founder: { "@type": "Person", name: about.founder.name, jobTitle: about.founder.title },
};

export default function Home() {
  return (
    <MotionProvider>
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
        <Experience />
        <Why />
        <Contact />
      </main>
      <SiteFooter />
      <FloatingActions />
    </MotionProvider>
  );
}
