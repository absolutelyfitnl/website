import type { Metadata } from "next";
import "./globals.css";
import "./premium-pass.css";
import "./reference-one.css";
import "./reference-match.css";
import "./final-polish.css";
import "./portal-premium.css";
import "./finish-pass.css";
import "./release-hardening.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { siteUrl } from "@/lib/metadata";

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: "Absolutely Fit Scheveningen — Fitness zoals het bedoeld is",
    template: "%s | Absolutely Fit",
  },
  description: "Professionele fitness, krachttraining en persoonlijke begeleiding bij familieclub Absolutely Fit in Scheveningen.",
  robots: { index: true, follow: true },
  icons: {
    icon: "/brand/absolutely-fit-symbol.svg",
    shortcut: "/brand/absolutely-fit-symbol.svg",
  },
  openGraph: {
    type: "website",
    locale: "nl_NL",
    siteName: "Absolutely Fit",
    title: "Absolutely Fit Scheveningen — Fitness zoals het bedoeld is",
    description: "Professionele fitness, krachttraining en persoonlijke begeleiding bij Absolutely Fit in Scheveningen.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Absolutely Fit — Fitness zoals het bedoeld is" }],
  },
  twitter: { card: "summary_large_image", images: ["/og.png"] },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl">
      <body className="antialiased">
        <a className="skip-link" href="#main-content">Naar hoofdinhoud</a>
        <SiteHeader />
        <div id="main-content" tabIndex={-1}>{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
}
