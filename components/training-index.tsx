"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

const routes = [
  { label: "Sterker worden", meta: "Kracht · techniek · progressie", title: "Bouw kracht die blijft.", text: "Werk gericht aan techniek, belastbaarheid en een opbouw die past bij jouw niveau.", image: "/images/strength-detail.webp", width: 1536, height: 1024, href: "/sporten/krachttraining" },
  { label: "Fitter worden", meta: "Conditie · energie · ritme", title: "Train voor meer energie.", text: "Combineer cardio en kracht in een realistisch ritme dat vol te houden is.", image: "/images/community-training.webp", width: 1919, height: 820, href: "/sporten/cardio-conditie" },
  { label: "Techniek verbeteren", meta: "Beweging · controle · vertrouwen", title: "Leer goed bewegen.", text: "Krijg heldere aanwijzingen en bouw van een sterke basis door naar zelfstandige training.", image: "/images/hero-coaching.webp", width: 1672, height: 941, href: "/begeleiding" },
  { label: "Beter presteren", meta: "Sport · planning · belastbaarheid", title: "Maak prestaties planbaar.", text: "Vertaal de eisen van jouw sport naar kracht, conditie en een doordacht trainingsprogramma.", image: "/images/community-training.webp", width: 1919, height: 820, href: "/sporten/strength-conditioning" },
];

export function TrainingIndex() {
  const [active, setActive] = useState(0);
  const route = routes[active];

  return (
    <div className="c90-route">
      <div className="c90-route__options" role="tablist" aria-label="Kies je trainingsdoel">
        {routes.map((item, index) => (
          <button key={item.label} type="button" role="tab" aria-selected={active === index} aria-controls="training-route-panel" className={active === index ? "is-active" : undefined} onClick={() => setActive(index)}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{item.label}</strong>
            <small>{item.meta}</small>
            <ArrowUpRight aria-hidden="true" />
          </button>
        ))}
      </div>
      <div className="c90-route__result" id="training-route-panel" role="tabpanel">
        <figure key={route.image + active}>
          <Image src={route.image} alt="Training en persoonlijke begeleiding bij Absolutely Fit" width={route.width} height={route.height} sizes="(max-width: 760px) 100vw, 50vw" />
          <figcaption>Jouw doel bepaalt het vertrekpunt. Samen maken we de route concreet.</figcaption>
        </figure>
        <div className="c90-route__copy">
          <span>Jouw startpunt</span><h3>{route.title}</h3><p>{route.text}</p>
          <Link href={route.href}>Bekijk deze trainingsroute <ArrowUpRight aria-hidden="true" /></Link>
        </div>
      </div>
    </div>
  );
}
