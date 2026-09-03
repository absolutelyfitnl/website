import type { Metadata } from "next";
import { privateRobots } from "@/lib/metadata";
export const metadata: Metadata = { title: "Backoffice — demo", description: "Fictieve lokale demonstratie van clubbeheer.", robots: privateRobots };
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
