"use client";

import { FormEvent, useState } from "react";
import { CheckCircle2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { memberships } from "@/lib/content/memberships";
import { contact } from "@/lib/content/site";

type ContactPrefill = {
  topic?: string;
  membership?: string;
  goal?: string;
  moment?: string;
  guidance?: string;
};

const goals = [["sterker", "Sterker worden"], ["fitter", "Fitter worden"], ["afvallen", "Afvallen"], ["spiermassa", "Spiermassa opbouwen"], ["prestatie", "Beter presteren"]] as const;
const moments = [["ochtend", "Ochtend"], ["middag", "Middag"], ["avond", "Avond"], ["wisselend", "Wisselend"]] as const;
const guidance = [["wegwijs", "Eerst wegwijs worden"], ["startplan", "Persoonlijk startplan"], ["coaching", "Regelmatige coaching"], ["weet-nog-niet", "Weet ik nog niet"], ["zelf", "Zelfstandig"], ["start", "Begeleide start"], ["intensief", "Intensieve coaching"]] as const;
const productOptions = memberships.map((membership) => [membership.id, membership.name] as const);

function ChoiceSelect({ label, name, value, options }: { label: string; name: string; value?: string; options: ReadonlyArray<readonly [string, string]> }) {
  return <label>{label}<Select name={name} defaultValue={value}><SelectTrigger><SelectValue placeholder="Nog niet gekozen" /></SelectTrigger><SelectContent>{options.map(([optionValue, optionLabel]) => <SelectItem value={optionValue} key={optionValue}>{optionLabel}</SelectItem>)}</SelectContent></Select></label>;
}

export function ContactForm({ prefill = {} }: { prefill?: ContactPrefill }) {
  const [sent, setSent] = useState(false);
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); setSent(true); };
  if (sent) return <div className="form-success" role="status" aria-live="polite"><CheckCircle2 aria-hidden="true" /><span className="eyebrow">Jouw aanvraag</span><h2 className="display">Klaar voor contact.</h2><p>Neem contact op met de club om je gratis intake of vraag persoonlijk af te ronden. Bel <a href={`tel:${contact.phoneHref}`}>{contact.phoneDisplay}</a> of mail naar <a href={`mailto:${contact.email}`}>{contact.email}</a>.</p><Button type="button" variant="outline" onClick={() => setSent(false)}>Gegevens aanpassen</Button></div>;
  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      {(prefill.topic || prefill.membership || prefill.goal || prefill.moment || prefill.guidance) && <div className="contact-prefill" role="status"><strong>Jouw keuze is alvast ingevuld.</strong><span>Je kunt de gegevens hieronder nog aanpassen.</span></div>}
      <div className="field-grid"><label>Naam<Input required name="name" placeholder="Jouw naam" /></label><label>E-mailadres<Input required type="email" name="email" placeholder="naam@voorbeeld.nl" /></label></div>
      <div className="field-grid"><label>Telefoonnummer <small>optioneel</small><Input type="tel" name="phone" placeholder="06 12 34 56 78" /></label><label>Waar kunnen we mee helpen?<Select required name="topic" defaultValue={prefill.topic}><SelectTrigger><SelectValue placeholder="Kies een onderwerp" /></SelectTrigger><SelectContent><SelectItem value="intake">Gratis persoonlijke intake</SelectItem><SelectItem value="abonnement">Abonnement of rittenkaart</SelectItem><SelectItem value="personal-training">Personal training</SelectItem><SelectItem value="begeleiding">Andere begeleiding</SelectItem><SelectItem value="ooievaarspas">Ooievaarspas</SelectItem><SelectItem value="anders">Andere vraag</SelectItem></SelectContent></Select></label></div>
      <ChoiceSelect label="Product dat je wilt bespreken (optioneel)" name="membership" value={prefill.membership} options={productOptions} />
      <div className="field-grid"><ChoiceSelect label="Jouw doel" name="goal" value={prefill.goal} options={goals} /><ChoiceSelect label="Voorkeursmoment" name="moment" value={prefill.moment} options={moments} /></div>
      <ChoiceSelect label="Gewenste begeleiding" name="guidance" value={prefill.guidance} options={guidance} />
      <label>Bericht<Textarea required name="message" placeholder="Vertel kort waar je aan wilt werken of wat je wilt weten." rows={6} /></label>
      <p className="contact-form__note">Rond je aanvraag persoonlijk af via telefoon of e-mail.</p>
      <Button type="submit" className="button-primary button-large">Bekijk contactmogelijkheden <Send aria-hidden="true" /></Button>
    </form>
  );
}
