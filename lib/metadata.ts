import type { Metadata } from "next";

const fallbackOrigin = "http://localhost:3000";
export const siteUrl = new URL(process.env.NEXT_PUBLIC_SITE_URL || fallbackOrigin);

type PageMetadataOptions = {
  type?: "website" | "article";
  image?: string;
  publishedTime?: string;
  modifiedTime?: string;
  robots?: Metadata["robots"];
};

export function pageMetadata(title: string, description: string, path: string, options: PageMetadataOptions = {}): Metadata {
  const image = options.image ?? "/og.png";
  const imageDetails = image === "/og.png"
    ? { url: image, width: 1200, height: 630, alt: "Absolutely Fit — Fitness zoals het bedoeld is" }
    : { url: image, alt: title };
  return {
    title,
    description,
    robots: options.robots,
    alternates: { canonical: path },
    openGraph: {
      type: options.type ?? "website",
      locale: "nl_NL",
      siteName: "Absolutely Fit",
      title,
      description,
      url: path,
      images: [imageDetails],
      ...(options.type === "article" && options.publishedTime ? { publishedTime: options.publishedTime } : {}),
      ...(options.type === "article" && options.modifiedTime ? { modifiedTime: options.modifiedTime } : {}),
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

export const privateRobots: Metadata["robots"] = {
  index: false,
  follow: false,
  nocache: true,
  googleBot: { index: false, follow: false, noimageindex: true },
};
