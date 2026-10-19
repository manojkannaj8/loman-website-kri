import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Schibsted_Grotesk } from "next/font/google";
import { site } from "@/lib/content";
import { INTRO_BOOT_SCRIPT } from "@/lib/intro";
import "./globals.css";

const bodoni = Bodoni_Moda({
  variable: "--font-bodoni",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  display: "swap",
});

const schibsted = Schibsted_Grotesk({
  variable: "--font-schibsted",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | Builders, Project Management & Quantity Surveying in Meath`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_IE",
    url: "/",
    siteName: site.name,
    title: `${site.name} | Building exceptional homes, under one roof`,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} | Building exceptional homes, under one roof`,
    description: site.description,
  },
};

export const viewport: Viewport = {
  themeColor: "#1e242c",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-IE" className={`${bodoni.variable} ${schibsted.variable} antialiased`} suppressHydrationWarning>
      <body className="min-h-dvh">
        {/* Decides before first paint whether the logo intro plays (see components/intro.tsx). */}
        <script dangerouslySetInnerHTML={{ __html: INTRO_BOOT_SCRIPT }} />
        {/* Without JS, entrance animations never run: show their content as-is. */}
        <noscript>
          <style>{`[style*="opacity:0"],[style*="opacity: 0"]{opacity:1!important;transform:none!important}[style*="clip-path"]{clip-path:none!important}`}</style>
        </noscript>
        {children}
      </body>
    </html>
  );
}
