import type { Metadata } from "next";
import { privateRobots } from "@/lib/metadata";

export const metadata: Metadata = { title: "Mijn Absolutely Fit", description: "Je persoonlijke ledenomgeving voor trainingen, planning, ledenpas, facturen en berichten.", robots: privateRobots };

export default function PortalLayout({ children }: { children: React.ReactNode }) { return children; }
