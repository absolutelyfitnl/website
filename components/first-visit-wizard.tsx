"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CalendarDays, Check, Clock3, Dumbbell, RotateCcw, Sparkles, UserRoundCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type Choice = { value: string; label: string; note: string };

const goals: Choice[] = [
  { value: "sterker", label: "Sterker worden", note: "Kracht, techniek en belastbaarheid" },
  { value: "fitter", label: "Fitter worden", note: "Conditie, energie en een vast ritme" },
  { value: "afvallen", label: "Afvallen", note: "Een haalbare aanpak die je kunt volhouden" },
  { value: "spiermassa", label: "Spiermassa opbouwen", note: "Gericht trainen en progressie volgen" },
  { value: "prestatie", label: "Beter presteren", note: "Sportspecifiek en doelgericht ontwikkelen" },
];

const moments: Choice[] = [
  { value: "ochtend", label: "In de ochtend", note: "Rustig starten en energiek je dag in" },
  { value: "middag", label: "In de middag", note: "Trainen tussen werk, studie of afspraken" },
  { value: "avond", label: "In de avond", note: "Na je werk of aan het einde van de dag" },
  { value: "wisselend", label: "Dat wisselt", note: "Samen zoeken naar een flexibel ritme" },
];

const guidance: Choice[] = [
  { value: "wegwijs", label: "Eerst wegwijs worden", note: "De club, apparatuur en basis rustig leren kennen" },
  { value: "startplan", label: "Een persoonlijk startplan", note: "Doel, oefeningen en trainingsweek helder op papier" },
  { value: "coaching", label: "Regelmatige coaching", note: "Techniekfeedback, evaluatie en bijsturen" },
  { value: "weet-nog-niet", label: "Dat weet ik nog niet", note: "We leggen de mogelijkheden zonder haast uit" },
];

const stepMeta = [
  { label: "Mijn doel", title: "Waar wil je aan werken?", icon: Dumbbell, options: goals },
  { label: "Mijn moment", title: "Wanneer train je het liefst?", icon: Clock3, options: moments },
  { label: "Begeleiding", title: "Wat heb je nodig om goed te beginnen?", icon: UserRoundCheck, options: guidance },
];

const resultCopy: Record<string, { title: string; intro: string; route: string[] }> = {
  sterker: { title: "Sterk beginnen, slim opbouwen.", intro: "We starten bij je huidige niveau en bouwen techniek, kracht en belastbaarheid stap voor stap op.", route: ["Kennismaking en doelbespreking", "Startniveau en techniek bekijken", "Een trainingsritme dat bij je week past"] },
  fitter: { title: "Meer energie in een haalbaar ritme.", intro: "Kracht en conditie komen samen in een aanpak die realistisch blijft naast werk, gezin of studie.", route: ["Jouw startpunt bespreken", "Kracht en conditie slim combineren", "Na de start samen evalueren"] },
  afvallen: { title: "Een aanpak die je kunt volhouden.", intro: "Geen snelle beloftes, wel een duidelijk trainingsritme en begeleiding die aansluit bij je dagelijks leven.", route: ["Doel en dagelijkse routine bespreken", "Een haalbare trainingsweek kiezen", "Consistentie en ontwikkeling volgen"] },
  spiermassa: { title: "Gericht bouwen aan progressie.", intro: "We brengen structuur in oefenkeuze, techniek en trainingsbelasting, passend bij jouw ervaring.", route: ["Ervaring en doel concreet maken", "Techniek en trainingsopbouw bepalen", "Voortgang op vaste momenten bespreken"] },
  prestatie: { title: "Train voor wat jouw sport vraagt.", intro: "Kracht, conditie, techniek en belastbaarheid worden verbonden aan de eisen van jouw sport.", route: ["Sport en wedstrijdcontext analyseren", "Fysieke prioriteiten bepalen", "Programmering rond jouw planning bouwen"] },
};

const momentRoute: Record<string, string> = {
  ochtend: "Een rustig ochtendmoment kiezen dat in je week past",
  middag: "Een vast middagmoment rond werk of studie plannen",
  avond: "Een realistisch avondritme opbouwen",
  wisselend: "Een flexibele weekstructuur met alternatieven maken",
};

const guidanceRoute: Record<string, string> = {
  wegwijs: "Samen de club, apparatuur en eerste oefeningen doorlopen",
  startplan: "Een persoonlijk startplan en trainingsweek uitwerken",
  coaching: "Vaste coachmomenten voor techniek en evaluatie afspreken",
  "weet-nog-niet": "Tijdens de kennismaking rustig de opties vergelijken",
};

type AnswerKey = "goal" | "moment" | "guidance";
type Answers = Record<AnswerKey, string | null>;
const emptyAnswers: Answers = { goal: null, moment: null, guidance: null };

export function FirstVisitWizard({ compact = false }: { compact?: boolean }) {
  const wizardId = useId();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>(emptyAnswers);
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const questionRef = useRef<HTMLHeadingElement>(null);
  const resultRef = useRef<HTMLHeadingElement>(null);
  const hasNavigated = useRef(false);
  const keys = ["goal", "moment", "guidance"] as const;
  const currentKey = keys[Math.min(step, 2)];
  const current = stepMeta[Math.min(step, 2)];
  const CurrentIcon = current.icon;
  const result = useMemo(() => resultCopy[answers.goal ?? "sterker"], [answers.goal]);
  const selectedChoice = current.options.find((item) => item.value === answers[currentKey]);
  const resultRoute = useMemo(() => [result.route[0], momentRoute[answers.moment ?? "wisselend"], guidanceRoute[answers.guidance ?? "weet-nog-niet"]], [answers.guidance, answers.moment, result.route]);
  const answerSummary = [
    ["Doel", goals.find((item) => item.value === answers.goal)?.label],
    ["Moment", moments.find((item) => item.value === answers.moment)?.label],
    ["Begeleiding", guidance.find((item) => item.value === answers.guidance)?.label],
  ];
  const answeredCount = Object.values(answers).filter(Boolean).length;
  const progressValue = step >= 3 ? 100 : (answeredCount / keys.length) * 100;
  const contactHref = `/contact?doel=${encodeURIComponent(answers.goal ?? "")}&moment=${encodeURIComponent(answers.moment ?? "")}&begeleiding=${encodeURIComponent(answers.guidance ?? "")}`;
  const reset = () => { hasNavigated.current = true; setDirection("back"); setAnswers(emptyAnswers); setStep(0); };
  const next = () => { if (!answers[currentKey]) return; hasNavigated.current = true; setDirection("forward"); setStep((value) => Math.min(3, value + 1)); };
  const previous = () => { hasNavigated.current = true; setDirection("back"); setStep((value) => Math.max(0, value - 1)); };

  useEffect(() => {
    if (!hasNavigated.current) return;
    const timer = window.setTimeout(() => (step < 3 ? questionRef.current : resultRef.current)?.focus({ preventScroll: true }), 80);
    return () => window.clearTimeout(timer);
  }, [step]);

  return (
    <section className={`visit-wizard ${compact ? "visit-wizard--compact" : ""}`} aria-labelledby={`${wizardId}-title`}>
      <div className="visit-wizard__header">
        <div><span className="ao-kicker"><Sparkles aria-hidden="true" /> Mijn eerste bezoek</span><h2 id={`${wizardId}-title`}>Begin met een plan dat bij jou past.</h2></div>
        <div className="visit-wizard__progress">
          <span>{step < 3 ? `Stap ${step + 1} van 3` : "Jouw startvoorstel"}<strong>{answeredCount}/3 gekozen</strong></span>
          <Progress value={progressValue} aria-label={`${Math.round(progressValue)} procent voltooid`} />
          <ol aria-label="Stappen">{stepMeta.map((item, index) => { const complete = step >= 3 || Boolean(answers[keys[index]]); const currentStep = index === step && step < 3; return <li key={item.label} className={currentStep ? "is-current" : complete ? "is-complete" : ""} aria-current={currentStep ? "step" : undefined}><i>{complete && !currentStep ? <Check aria-hidden="true" /> : index + 1}</i>{item.label}</li>; })}</ol>
        </div>
      </div>

      {step < 3 ? (
        <div key={step} className={`visit-wizard__body visit-wizard__body--${direction}`}>
          <div className="visit-wizard__form">
            <div className="visit-wizard__question"><CurrentIcon aria-hidden="true" /><span>0{step + 1}</span><h3 id={`${wizardId}-question-${step}`} ref={questionRef} tabIndex={-1}>{current.title}</h3><p>Kies wat nu het beste past. Je zit nergens aan vast; tijdens een kennismaking maken we het persoonlijk.</p>{selectedChoice && <div className="visit-wizard__current"><Check aria-hidden="true" /><span><small>Jouw keuze</small><strong>{selectedChoice.label}</strong></span></div>}</div>
            <RadioGroup value={answers[currentKey] ?? ""} aria-labelledby={`${wizardId}-question-${step}`} onValueChange={(value) => setAnswers((previous) => ({ ...previous, [currentKey]: value }))} className="visit-wizard__choices">
              {current.options.map((choice) => <label key={choice.value} className="visit-choice" data-selected={answers[currentKey] === choice.value}><RadioGroupItem value={choice.value} /><span><strong>{choice.label}</strong><small>{choice.note}</small></span><Check aria-hidden="true" /></label>)}
            </RadioGroup>
            <div className="visit-wizard__actions"><Button type="button" variant="ghost" onClick={previous} disabled={step === 0}><ArrowLeft aria-hidden="true" /> Vorige</Button><span>{selectedChoice ? `${selectedChoice.label} geselecteerd` : "Kies één optie om verder te gaan"}</span><Button type="button" className="ao-button ao-button--blue" onClick={next} disabled={!answers[currentKey]}>Volgende stap <ArrowRight aria-hidden="true" /></Button></div>
          </div>
          {compact && <aside className="visit-wizard__preview" aria-live="polite"><div className="visit-wizard__preview-top"><span><Sparkles aria-hidden="true" /> Live startplan</span><i>{answeredCount}/3</i></div><h4>{answeredCount ? "Jouw route krijgt vorm." : "Vertel ons waar je wilt beginnen."}</h4><div className="visit-wizard__preview-list">{answerSummary.map(([label, value], index) => <div key={label} data-complete={Boolean(value)}><i>{value ? <Check aria-hidden="true" /> : `0${index + 1}`}</i><span><small>{label}</small><strong>{value ?? "Nog te kiezen"}</strong></span></div>)}</div><p>Geen automatische verkooproute. Een coach bespreekt het voorstel persoonlijk met je.</p></aside>}
        </div>
      ) : (
        <div key="result" className="visit-result visit-result--forward" aria-live="polite">
          <div className="visit-result__copy"><span className="ao-kicker"><Check aria-hidden="true" /> Jouw startvoorstel</span><h3 ref={resultRef} tabIndex={-1}>{result.title}</h3><p>{result.intro}</p><dl><div><dt>Doel</dt><dd>{goals.find((item) => item.value === answers.goal)?.label}</dd></div><div><dt>Moment</dt><dd>{moments.find((item) => item.value === answers.moment)?.label}</dd></div><div><dt>Begeleiding</dt><dd>{guidance.find((item) => item.value === answers.guidance)?.label}</dd></div></dl><div className="visit-result__actions"><Button asChild className="ao-button ao-button--blue"><Link href={contactHref}>Plan een kennismaking <CalendarDays aria-hidden="true" /></Link></Button><Button type="button" variant="ghost" onClick={reset}><RotateCcw aria-hidden="true" /> Opnieuw</Button></div></div>
          <div className="visit-result__route"><span>Dit kun je verwachten</span>{resultRoute.map((item, index) => <div key={item} style={{ "--route-delay": `${index * 70}ms` } as React.CSSProperties}><i>0{index + 1}</i><strong>{item}</strong></div>)}<p>Dit startvoorstel is demonstratief en geen automatisch trainingsadvies. De coach bepaalt de uiteindelijke aanpak samen met jou.</p></div>
        </div>
      )}
    </section>
  );
}
