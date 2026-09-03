"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, RotateCcw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const goals = [
  { value: "sterker", label: "Sterker worden", note: "Meer kracht en belastbaarheid" },
  { value: "fitter", label: "Fitter worden", note: "Conditie en dagelijkse energie" },
  { value: "afvallen", label: "Afvallen", note: "Een haalbare, consistente aanpak" },
  { value: "spiermassa", label: "Spiermassa opbouwen", note: "Gerichte progressie en techniek" },
  { value: "prestatie", label: "Beter presteren", note: "Sportspecifieke ontwikkeling" },
];
const experience = [
  { value: "start", label: "Ik begin (opnieuw)", note: "Eerst een sterke basis leggen" },
  { value: "regelmatig", label: "Ik train regelmatig", note: "Meer structuur en progressie" },
  { value: "ervaren", label: "Ik train op niveau", note: "Details, programmering en prestatie" },
];
const guidance = [
  { value: "zelf", label: "Zelfstandig", note: "Met een duidelijk startplan" },
  { value: "start", label: "Begeleide start", note: "Techniek, schema en evaluatie" },
  { value: "intensief", label: "Intensieve coaching", note: "Regelmatig samen bijsturen" },
];
const recommendations: Record<string, { title: string; mix: string[]; text: string }> = {
  sterker: { title: "Kracht met een plan", mix: ["Krachttraining", "Techniektraining", "Persoonlijk schema"], text: "Een rustige opbouw in basisoefeningen, met aandacht voor techniek en meetbare progressie." },
  fitter: { title: "Sterk én conditioneel", mix: ["Cardio & conditie", "Spierconditie", "Krachttraining"], text: "Een afwisselende trainingsweek die conditie en kracht combineert zonder onnodige ingewikkeldheid." },
  afvallen: { title: "Een ritme dat je volhoudt", mix: ["Krachttraining", "Conditie", "Persoonlijke begeleiding"], text: "De focus ligt op consistentie, een haalbare trainingsbelasting en begeleiding die bij jouw dagelijks leven past." },
  spiermassa: { title: "Gericht bouwen", mix: ["Krachttraining", "Bodybuilding", "Trainingsschema"], text: "Een progressief schema met passende trainingsvolumes, goede uitvoering en vaste evaluatiemomenten." },
  prestatie: { title: "Train voor je sport", mix: ["Strength & Conditioning", "Sportspecifieke training", "Programmering"], text: "We verbinden kracht, conditie, techniek en belastbaarheid aan de eisen van jouw sport." },
};

export function TrainingRoute() {
  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState<string | null>(null);
  const [level, setLevel] = useState<string | null>(null);
  const [support, setSupport] = useState<string | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const hasNavigated = useRef(false);
  const currentOptions = step === 0 ? goals : step === 1 ? experience : guidance;
  const currentValue = step === 0 ? goal : step === 1 ? level : support;
  const setCurrentValue = step === 0 ? setGoal : step === 1 ? setLevel : setSupport;
  const answeredCount = [goal, level, support].filter(Boolean).length;
  const result = useMemo(() => {
    const base = recommendations[goal ?? "sterker"];
    const levelPlan = level === "start" ? "Basisbewegingen en startniveau rustig bepalen" : level === "regelmatig" ? "Huidige training analyseren en progressie structureren" : "Details, belasting en programmering aanscherpen";
    const supportPlan = support === "zelf" ? "Een zelfstandig plan met een helder evaluatiemoment" : support === "start" ? "Een begeleide start met techniekfeedback en evaluatie" : "Regelmatige coachmomenten en intensief bijsturen";
    return { ...base, levelPlan, supportPlan };
  }, [goal, level, support]);
  const reset = () => { hasNavigated.current = true; setGoal(null); setLevel(null); setSupport(null); setStep(0); };
  const moveTo = (nextStep: number) => { hasNavigated.current = true; setStep(Math.max(0, Math.min(3, nextStep))); };

  useEffect(() => {
    if (!hasNavigated.current) return;
    headingRef.current?.focus({ preventScroll: true });
  }, [step]);

  return (
    <div className="route-widget" id="trainingsroute">
      <div className="route-widget__top"><div><span className="eyebrow">Interactieve trainingsroute</span><h2 className="display display--widget">Wat past bij jou?</h2></div><div className="route-progress" aria-label={step < 3 ? `Vraag ${step + 1} van 3` : "Persoonlijke richting voltooid"}><span>{step < 3 ? `Vraag 0${step + 1} / 03 · ${answeredCount}/3 gekozen` : "Jouw route"}</span><Progress value={(answeredCount / 3) * 100} aria-label={`${answeredCount} van 3 vragen beantwoord`} /></div></div>
      {step < 3 ? (
        <div className="route-widget__body">
          <div className="route-question"><span className="route-question__number">0{step + 1}</span><div><h3 id={`route-question-${step}`} ref={headingRef} tabIndex={-1}>{step === 0 ? "Wat wil je bereiken?" : step === 1 ? "Hoeveel ervaring heb je?" : "Hoe wil je begeleid worden?"}</h3><p>Kies wat nu het beste bij je past. Tijdens een kennismaking maken we het plan persoonlijk.</p></div></div>
          <RadioGroup value={currentValue ?? ""} aria-labelledby={`route-question-${step}`} onValueChange={setCurrentValue} className="route-options">
            {currentOptions.map((option) => <label className="route-option" key={option.value} data-selected={currentValue === option.value}><RadioGroupItem value={option.value} /><span><strong>{option.label}</strong><small>{option.note}</small></span><Check className="route-option__check" aria-hidden="true" /></label>)}
          </RadioGroup>
          <div className="route-actions"><Button type="button" variant="ghost" onClick={() => moveTo(step - 1)} disabled={step === 0}><ArrowLeft aria-hidden="true" /> Vorige</Button><Button type="button" className="button-primary button-large" onClick={() => currentValue && moveTo(step + 1)} disabled={!currentValue}>Volgende stap <ArrowRight aria-hidden="true" /></Button></div>
        </div>
      ) : (
        <div className="route-result" aria-live="polite"><div className="route-result__copy"><span className="result-kicker"><Sparkles aria-hidden="true" /> Jouw startpunt</span><h3 ref={headingRef} tabIndex={-1}>{result.title}</h3><p>{result.text}</p><ul>{result.mix.map((item) => <li key={item}><Check aria-hidden="true" />{item}</li>)}</ul><div className="route-result__actions"><Button asChild className="button-primary button-large"><Link href={`/contact?doel=${encodeURIComponent(goal ?? "")}&begeleiding=${encodeURIComponent(support ?? "")}`}>Plan een kennismaking</Link></Button><Button type="button" variant="ghost" onClick={reset}><RotateCcw aria-hidden="true" />Opnieuw</Button></div></div><div className="route-result__plan"><span>Jouw antwoorden vertaald</span><div><strong>01</strong><p>Kennismaken en jouw doel concreet maken</p></div><div><strong>02</strong><p>{result.levelPlan}</p></div><div><strong>03</strong><p>{result.supportPlan}</p></div><small>Dit is een persoonlijke richting op basis van je drie keuzes, geen automatisch trainingsadvies. De coach maakt het definitieve plan samen met jou.</small></div></div>
      )}
    </div>
  );
}
