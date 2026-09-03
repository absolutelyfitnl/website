"use client";

import Image from "next/image";
import { Bell, CalendarDays, Check, CreditCard, Dumbbell, Home, Newspaper, QrCode } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const tabs = [
  { value: "home", label: "Home", icon: Home },
  { value: "pass", label: "Ledenpas", icon: QrCode },
  { value: "training", label: "Training", icon: Dumbbell },
  { value: "club", label: "Club", icon: Newspaper },
];

export function MemberAppDemo() {
  return (
    <Tabs defaultValue="home" className="member-demo">
      <div className="member-demo__screen">
        <div className="member-demo__status"><span>09:41</span><Bell aria-hidden="true" /></div>
        <div className="member-demo__brand"><Image src="/brand/absolutely-fit-lockup.svg" alt="Absolutely Fit" width={590} height={142} sizes="130px" /><span>In ontwikkeling</span></div>
        <TabsContent value="home"><small>Goedemorgen</small><h3>Vandaag trainen?</h3><div className="demo-open"><i />Clubinformatie bekijken</div><div className="demo-primary"><span>Volgende training</span><strong>Upper body strength</strong><small>Vandaag · 18:00</small></div><div className="demo-grid"><div><CreditCard /><span>Lidmaatschap</span></div><div><CalendarDays /><span>Planning</span></div></div></TabsContent>
        <TabsContent value="pass"><small>Lidmaatschap</small><h3>Jouw ledenpas</h3><div className="demo-pass"><QrCode aria-hidden="true" /><strong>Absolutely Fit</strong><span>Lidmaatschap actief</span><small>Toekomstige QR-toegang</small></div></TabsContent>
        <TabsContent value="training"><small>Mijn programma</small><h3>Deze week</h3><div className="demo-workout"><div><span>Ma</span><p><strong>Lower body</strong><small>5 oefeningen</small></p><Check /></div><div className="is-next"><span>Wo</span><p><strong>Upper body</strong><small>6 oefeningen</small></p><Dumbbell /></div><div><span>Za</span><p><strong>Conditie</strong><small>40 minuten</small></p><CalendarDays /></div></div></TabsContent>
        <TabsContent value="club"><small>Nieuws & praktisch</small><h3>Uit de club</h3><div className="demo-news"><article><span>Clubnieuws</span><strong>Nieuwe trainingsweek</strong><small>Vandaag</small></article><article><span>Openingstijden</span><strong>Bekijk voor je bezoek de actuele tijden</strong><small>Praktisch</small></article><article><span>Bericht</span><strong>Vraag het team om begeleiding</strong><small>Contact</small></article></div></TabsContent>
      </div>
      <TabsList className="member-demo__tabs">{tabs.map(({ value, label, icon: Icon }) => <TabsTrigger value={value} key={value}><Icon aria-hidden="true" /><span>{label}</span></TabsTrigger>)}</TabsList>
    </Tabs>
  );
}
