import type { Metadata } from "next";

const fallbackOrigin = "http://localhost:3000";
export const siteUrl = new URL(process.env.NEXT_PUBLIC_SITE_URL || fallbackOrigin);

export function pageMetadata(title: string, description: string, path: string): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "nl_NL",
      siteName: "Absolutely Fit",
      title,
      description,
      url: path,
      images: [{ url: "/og.png", width: 1200, height: 630, alt: "Absolutely Fit — Fitness zoals het bedoeld is" }],
    },
    twitter: { card: "summary_large_image", title, description, images: ["/og.png"] },
  };
}

export const privateRobots: Metadata["robots"] = {
  index: false,
  follow: false,
  nocache: true,
  googleBot: { index: false, follow: false, noimageindex: true },
};
