import type { Metadata } from "next";
import { privateRobots } from "@/lib/metadata";
export const metadata: Metadata = { title: "Backoffice — Absolutely Fit", description: "Beheeromgeving voor planning, leden en clubcommunicatie.", robots: privateRobots };
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
