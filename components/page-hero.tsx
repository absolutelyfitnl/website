import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

type PageHeroProps = {
  eyebrow: string;
  title: React.ReactNode;
  intro: string;
  image: string;
  imageAlt: string;
  parentHref?: string;
  parentLabel?: string;
  variant?: "default" | "reverse" | "full";
};

export function PageHero({ eyebrow, title, intro, image, imageAlt, parentHref, parentLabel, variant = "default" }: PageHeroProps) {
  const [imageWidth, imageHeight] = image.endsWith("community-training.webp")
    ? [1919, 820]
    : image.endsWith("hero-coaching.webp")
      ? [1672, 941]
      : [1536, 1024];

  return (
    <section className={`page-hero shell-wide page-hero--${variant}`}>
      <Image className="page-hero__ribbon" src="/brand/absolutely-fit-ribbon-wide.svg" alt="" aria-hidden="true" width={1600} height={900} sizes="100vw" />
      <div className="page-hero__copy">
        {parentHref && <Link className="back-link" href={parentHref}><ArrowLeft aria-hidden="true" />{parentLabel}</Link>}
        <span className="eyebrow">{eyebrow}</span>
        <h1 className="display">{title}</h1>
        <p>{intro}</p>
      </div>
      <div className="page-hero__media"><Image src={image} alt={imageAlt} width={imageWidth} height={imageHeight} sizes="(max-width: 760px) 100vw, 50vw" unoptimized /></div>
    </section>
  );
}
