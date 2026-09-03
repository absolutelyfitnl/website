import type { Metadata } from "next";
import { privateRobots } from "@/lib/metadata";

export const metadata: Metadata = { title: "Ledenportaal — demo", description: "Fictieve demonstratie van de toekomstige ledenomgeving.", robots: privateRobots };

export default function PortalLayout({ children }: { children: React.ReactNode }) { return children; }
