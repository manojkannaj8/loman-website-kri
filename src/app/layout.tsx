import type { Metadata, Viewport } from "next";
import { Archivo, IBM_Plex_Mono } from "next/font/google";
import { site } from "@/lib/content";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | Construction, Project Management & Quantity Surveying, Co. Meath`,
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
  themeColor: "#f1eee8",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-IE" className={`${archivo.variable} ${plexMono.variable} antialiased`}>
      <body className="min-h-dvh">
        {/* Without JS, entrance animations never run — show their content as-is. */}
        <noscript>
          <style>{`[style*="opacity:0"],[style*="opacity: 0"]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        {children}
      </body>
    </html>
  );
}
