export type ArticleSection = {
  heading: string;
  paragraphs: readonly string[];
  points?: readonly string[];
};

export type KnowledgeArticle = {
  slug: string;
  category: string;
  title: string;
  intro: string;
  image: string;
  readTime: string;
  publishedAt: string;
  updatedAt: string;
  sections: readonly ArticleSection[];
  takeaway: string;
  relatedHref: string;
  relatedLabel: string;
  affiliatePlacement?: boolean;
};

export const articles: readonly KnowledgeArticle[] = [
  {
    slug: "kleine-stappen-duurzaam-sterker",
    category: "Trainingsritme",
    title: "Kleine stappen, duurzaam sterker: zo bouw je een trainingsritme op",
    intro: "Een trainingsritme hoeft niet groot te beginnen. Met een haalbare week, duidelijke keuzes en ruimte om bij te sturen bouw je aan vooruitgang die in je dagelijks leven past.",
    image: "/images/community-training.webp",
    readTime: "7 min",
    publishedAt: "2026-09-07",
    updatedAt: "2026-09-07",
    sections: [
      { heading: "Begin bij wat werkelijk past", paragraphs: ["Kijk eerst hoeveel tijd je op een normale week beschikbaar hebt. Eén of twee betrouwbare momenten zijn een beter vertrekpunt dan een ambitieus schema dat alleen in een ideale week lukt.", "Koppel elk moment aan een herkenbaar anker, zoals na je werk of op een vaste weekendochtend. Zo wordt trainen een concrete afspraak in plaats van een voornemen zonder plek."] },
      { heading: "Maak de eerste stap klein genoeg", paragraphs: ["Een eerste trainingsweek hoeft niet alles te bevatten. Kies enkele bewegingen die je rustig kunt leren en houd voldoende ruimte over om de uitvoering te begrijpen."], points: ["Plan een realistisch aantal momenten", "Houd de eerste trainingen overzichtelijk", "Noteer wat goed ging en waar je vragen over hebt"] },
      { heading: "Evalueer zonder haast", paragraphs: ["Vooruitgang kan meer gewicht of een extra herhaling zijn, maar ook meer vertrouwen, een betere uitvoering of minder twijfel over je planning.", "Bespreek na een paar weken wat haalbaar bleek. Pas daarna één onderdeel tegelijk aan, zodat duidelijk blijft welke keuze helpt."] },
    ],
    takeaway: "Kies een ritme dat ook in een gewone week uitvoerbaar blijft en bouw van daaruit rustig verder.",
    relatedHref: "/gratis-persoonlijke-intake",
    relatedLabel: "Bespreek je start tijdens een gratis intake",
  },
  {
    slug: "beginnen-met-krachttraining-scheveningen",
    category: "Krachttraining",
    title: "Beginnen met krachttraining in Scheveningen: wat kun je verwachten?",
    intro: "Je hoeft geen ervaring te hebben om met krachttraining te beginnen. Een rustige kennismaking met de ruimte, bewegingen en belasting geeft een duidelijk startpunt.",
    image: "/images/strength-detail.webp",
    readTime: "6 min",
    publishedAt: "2026-09-07",
    updatedAt: "2026-09-07",
    sections: [
      { heading: "Eerst begrijpen waar je begint", paragraphs: ["Tijdens een eerste gesprek bespreek je waarom je wilt trainen, wat je al hebt gedaan en hoeveel tijd je meestal beschikbaar hebt. Dat voorkomt dat je meteen in een programma stapt dat niet bij je week past.", "Je hoeft vooraf geen oefeningen of trainingsmethode te kiezen. De eerste stap is vooral helder krijgen wat jij nodig hebt om met vertrouwen te starten."] },
      { heading: "Techniek vóór haast", paragraphs: ["Bij nieuwe bewegingen ligt de nadruk op een stabiele uitgangspositie, een beheerst tempo en een belasting die je goed kunt sturen."], points: ["Vraag uitleg wanneer iets niet duidelijk voelt", "Begin met een gewicht dat controle toelaat", "Voeg pas iets toe wanneer de basis herhaalbaar is"] },
      { heading: "Van begeleiding naar zelfstandigheid", paragraphs: ["Goede begeleiding maakt niet iedere keuze voor je. Ze helpt je begrijpen waarom een oefening in je plan staat en waar je tijdens de uitvoering op let.", "Zo kun je steeds zelfstandiger trainen en weet je wanneer het zinvol is om opnieuw feedback te vragen."] },
    ],
    takeaway: "Een duidelijke start draait om begrijpen, oefenen en stap voor stap vertrouwen opbouwen.",
    relatedHref: "/sporten/krachttraining",
    relatedLabel: "Bekijk krachttraining bij Absolutely Fit",
    affiliatePlacement: true,
  },
  {
    slug: "topsportkennis-voor-ieder-niveau",
    category: "Begeleiding",
    title: "Topsportkennis voor ieder niveau: wat betekent dat in de praktijk?",
    intro: "Principes uit de prestatiesport worden pas waardevol wanneer ze begrijpelijk en passend worden gemaakt voor de persoon die voor je staat.",
    image: "/images/hero-coaching.webp",
    readTime: "7 min",
    publishedAt: "2026-09-07",
    updatedAt: "2026-09-08",
    sections: [
      { heading: "Ervaring als stevig vertrekpunt", paragraphs: ["De krachtsportgeschiedenis van Absolutely Fit is concreet: oprichter Rik Priester werd meervoudig Nederlands kampioen en in 1990 wereldkampioen powerliften. Het team deed daarnaast ervaring op met begeleiding tot nationaal, internationaal en olympisch niveau.", "Die achtergrond is geen reden om iedereen als wedstrijdsporter te behandelen. Juist de vertaalslag naar een haalbaar persoonlijk plan maakt de ervaring bruikbaar op de dagelijkse clubvloer."] },
      { heading: "Het principe blijft, de uitvoering verandert", paragraphs: ["Een ervaren wedstrijdsporter en iemand die net begint hebben niet hetzelfde programma nodig. Beiden hebben wel baat bij een helder doel, passende belasting en aandacht voor herstel tussen trainingen.", "De kunst zit in vertalen: niet méér ingewikkeld maken, maar kiezen welke trainingsprincipes nu relevant zijn."] },
      { heading: "Meten wat voor jou betekenis heeft", paragraphs: ["Niet iedere sporter hoeft maximale prestaties te testen. Voortgang kan ook blijken uit een stabielere beweging, een training die beter in de week past of meer vertrouwen in zelfstandig oefenen."], points: ["Maak het doel concreet", "Kies een passende maat voor voortgang", "Evalueer op vaste, rustige momenten"] },
      { heading: "Coaching is ook uitleg", paragraphs: ["Een schema zonder context geeft weinig houvast. Wanneer je begrijpt waarom belasting, herhalingen en rustmomenten zijn gekozen, kun je betere beslissingen nemen.", "Daarom horen vragen stellen en techniek bespreken net zo goed bij begeleiding als het programma zelf."] },
    ],
    takeaway: "Topsportkennis werkt wanneer de principes zorgvuldig worden vertaald naar jouw niveau, doel en week.",
    relatedHref: "/topsport-en-ntc",
    relatedLabel: "Lees hoe Absolutely Fit kennis vertaalt",
  },
  {
    slug: "wat-gebeurt-er-tijdens-een-gratis-persoonlijke-intake",
    category: "Gratis intake",
    title: "Wat gebeurt er tijdens een gratis persoonlijke intake?",
    intro: "De gratis persoonlijke intake is een gesprek over je doel, ervaring en planning. Je hoeft nog niets gekozen te hebben en het is geen proeftraining.",
    image: "/images/absolutely-fit-hero-cable-coaching.png",
    readTime: "5 min",
    publishedAt: "2026-09-07",
    updatedAt: "2026-09-07",
    sections: [
      { heading: "Jouw vraag staat centraal", paragraphs: ["We beginnen met wat je wilt bereiken en waarom dat nu belangrijk voor je is. Ook bespreken we of je eerder hebt getraind en welke momenten meestal haalbaar zijn.", "Je deelt alleen informatie die nodig is om de trainingsmogelijkheden te bespreken. Een marketingformulier vraagt niet om medische dossiers of Ooievaarspasgegevens."] },
      { heading: "Je bekijkt de mogelijkheden", paragraphs: ["We leggen uit hoe zelfstandig trainen, begeleiding en personal training zich tot elkaar verhouden. Ook kun je de vier actuele producttypen bespreken."], points: ["1× per week", "Onbeperkt trainen", "10-rittenkaart", "Jeugd"] },
      { heading: "Een concrete vervolgstap", paragraphs: ["Aan het einde weet je welke vervolgstap logisch kan zijn. Dat kan een passend trainingsmoment, meer uitleg over personal training of eerst aanvullende productinformatie zijn.", "Prijzen en voorwaarden worden actueel door de club toegelicht; de website vult ontbrekende commerciële details niet zelf in."] },
    ],
    takeaway: "De gratis intake geeft je een persoonlijk en eerlijk vertrekpunt, zonder dat de website al voor jou beslist.",
    relatedHref: "/gratis-persoonlijke-intake",
    relatedLabel: "Start de intakevoorbereiding",
  },
  {
    slug: "sporten-met-de-ooievaarspas-bij-absolutely-fit",
    category: "Ooievaarspas",
    title: "Sporten met de Ooievaarspas bij Absolutely Fit",
    intro: "Met een geldige Ooievaarspas ontvang je 50% korting op een daarvoor in aanmerking komend abonnement. De actuele toepassing bespreek je persoonlijk met de club.",
    image: "/images/cardio-sunrise.jpg",
    readTime: "5 min",
    publishedAt: "2026-09-07",
    updatedAt: "2026-09-07",
    sections: [
      { heading: "Wat de korting betekent", paragraphs: ["De bevestigde kern is 50% korting op een daarvoor in aanmerking komend abonnement. Welke actuele productoptie en voorwaarden precies gelden, wordt tijdens contact of de gratis intake met je besproken.", "De 10-rittenkaart of alle vier producten worden niet automatisch als geschikt aangemerkt zolang die toepassing niet is bevestigd."] },
      { heading: "Wat je zelf regelt", paragraphs: ["De gemeente Den Haag bepaalt wie voor de Ooievaarspas in aanmerking komt en hoe de aanvraag verloopt. Gebruik daarvoor altijd de actuele officiële informatie van de gemeente."], points: ["Vraag de pas aan via de officiële gemeentepagina", "Neem contact op met Absolutely Fit", "Bespreek de actuele abonnementsoptie en voorwaarden"] },
      { heading: "Privacy bij je eerste contact", paragraphs: ["Stuur via een algemeen marketingformulier geen inkomensbewijs of volledige pasgegevens. Kies alleen het onderwerp Ooievaarspas, zodat de club weet waar je vraag over gaat.", "Wanneer aanvullende controle nodig is, vertelt de club welk veilig proces daarvoor geldt."] },
    ],
    takeaway: "Gebruik officiële gemeentelijke informatie voor de aanvraag en bespreek de actuele 50%-toepassing rechtstreeks met Absolutely Fit.",
    relatedHref: "/ooievaarspas",
    relatedLabel: "Bekijk de Ooievaarspasinformatie",
  },
  {
    slug: "sportschool-als-ontmoetingsplek-havenkwartier",
    category: "Clubverhaal",
    title: "Een sportschool als ontmoetingsplek in het Havenkwartier",
    intro: "Sinds 1998 is Absolutely Fit een vaste plek in het Scheveningse Havenkwartier, waar verschillende achtergronden en trainingsniveaus elkaar op de clubvloer ontmoeten.",
    image: "/images/club-exterior.webp",
    readTime: "6 min",
    publishedAt: "2026-09-07",
    updatedAt: "2026-09-07",
    sections: [
      { heading: "Een vertrouwde plek aan de haven", paragraphs: ["Een club krijgt betekenis door de mensen die er steeds opnieuw binnenstappen. In het Havenkwartier komen buurtgenoten, mensen die er werken en nieuwkomers samen met ieder hun eigen reden om te trainen.", "De trainingsvloer is professioneel ingericht, maar de sfeer blijft persoonlijk en laagdrempelig."] },
      { heading: "Verschillende doelen, dezelfde aandacht", paragraphs: ["De één wil voor het eerst structuur opbouwen, de ander werkt gericht aan kracht of sportprestaties. Die verschillen hoeven geen afstand te creëren."], points: ["Ruimte om vragen te stellen", "Respect voor ieders startpunt", "Kennis delen zonder grootspraak"] },
      { heading: "Familieclub als dagelijkse praktijk", paragraphs: ["Familiekarakter zit niet alleen in de geschiedenis van de onderneming. Het blijkt vooral uit herkenning, betrokkenheid en de bereidheid om iemand rustig op weg te helpen.", "Zo kan serieus trainen samengaan met prettig binnenkomen — al sinds 1998."] },
    ],
    takeaway: "Een sterke club wordt gebouwd met goede training én met aandacht voor de mensen die er samenkomen.",
    relatedHref: "/over-ons",
    relatedLabel: "Lees het verhaal van de club",
  },
  {
    slug: "sterker-worden-begint-met-techniek",
    category: "Training",
    title: "Sterker worden begint met techniek",
    intro: "Een goede uitvoering helpt je kracht doelgericht op te bouwen en te begrijpen wat een oefening van je vraagt.",
    image: "/images/strength-detail.webp",
    readTime: "6 min",
    publishedAt: "2026-08-20",
    updatedAt: "2026-09-07",
    sections: [
      { heading: "Techniek is een middel", paragraphs: ["Bij krachttraining is techniek er om een beweging herhaalbaar en passend te maken. De bruikbare uitvoering is niet voor iedereen exact hetzelfde: lichaamsbouw, ervaring en doel spelen mee.", "Een passende techniek geeft controle over het gewicht en ruimte om de belasting geleidelijk op te bouwen."] },
      { heading: "Eerst controle, dan gewicht", paragraphs: ["Meer gewicht toevoegen is pas zinvol wanneer je de beweging voldoende kunt sturen."], points: ["Kies een stabiele startpositie", "Houd het tempo beheerst", "Stop wanneer de uitvoering duidelijk verandert"] },
      { heading: "Feedback ondersteunt het leren", paragraphs: ["Een spiegel of video kan helpen, maar gerichte feedback maakt vaak sneller duidelijk wat er gebeurt. Eén concrete aanwijzing per set is meestal overzichtelijker dan veel correcties tegelijk.", "Goed bewegen is een vaardigheid die door aandachtige herhaling groeit."] },
    ],
    takeaway: "Bouw oefeningen op vanuit controle en kies een belasting die je technisch kunt blijven sturen.",
    relatedHref: "/sporten/krachttraining",
    relatedLabel: "Bekijk onze aanpak bij krachttraining",
    affiliatePlacement: true,
  },
  {
    slug: "waarom-herstel-bij-training-hoort",
    category: "Herstel",
    title: "Waarom herstel bij training hoort",
    intro: "Training geeft een prikkel; tijdens herstel krijgt je lichaam ruimte om die belasting te verwerken. Beide horen bij een haalbaar plan.",
    image: "/images/cardio-sunrise.jpg",
    readTime: "5 min",
    publishedAt: "2026-08-12",
    updatedAt: "2026-09-07",
    sections: [
      { heading: "Vooruitgang vraagt ruimte", paragraphs: ["Een zware training kan productief voelen, maar meer is niet automatisch beter. De benodigde herstelruimte verschilt per trainingsniveau, dagelijks ritme en belasting.", "Een programma is pas bruikbaar wanneer het rekening houdt met de week buiten de club."] },
      { heading: "Let op patronen", paragraphs: ["Een mindere training is normaal. Wanneer vermoeidheid en teruglopende uitvoering zich opstapelen, is dat informatie om je planning te heroverwegen."], points: ["Houd je slaapritme zo regelmatig mogelijk", "Plan rustige dagen bewust", "Bespreek structurele terugval met een passende professional"] },
      { heading: "Rust hoeft niet ingewikkeld te zijn", paragraphs: ["Rustig bewegen kan op een hersteldag prettig zijn. Het doel is niet om alsnog een zware sessie te maken, maar om ruimte te houden voor de volgende training.", "Een realistische planning voorkomt dat iedere sessie maximaal hoeft te zijn."] },
    ],
    takeaway: "Plan herstel bewust, zodat je trainingsritme over meerdere weken uitvoerbaar blijft.",
    relatedHref: "/begeleiding",
    relatedLabel: "Lees hoe begeleiding wordt opgebouwd",
  },
  {
    slug: "zo-bouw-je-een-trainingsschema-op",
    category: "Kennis",
    title: "Zo bouw je een trainingsschema op",
    intro: "Een bruikbaar schema begint bij een helder doel, een realistische week en een opbouw die je kunt blijven uitvoeren.",
    image: "/images/community-training.webp",
    readTime: "8 min",
    publishedAt: "2026-08-04",
    updatedAt: "2026-09-07",
    sections: [
      { heading: "Begin bij je week", paragraphs: ["Bepaal hoeveel momenten meestal echt beschikbaar zijn. Twee consistente trainingen kunnen meer houvast geven dan een vijfdaags schema dat niet in je agenda past.", "Kijk vervolgens waar voldoende ruimte tussen de belangrijkste sessies zit."] },
      { heading: "Kies de hoofdzaken", paragraphs: ["Selecteer bewegingen die passen bij je doel en die je beheerst kunt uitvoeren."], points: ["Koppel oefeningen aan je doel", "Beperk onnodige variatie", "Noteer sets, herhalingen en belasting"] },
      { heading: "Maak ontwikkeling zichtbaar", paragraphs: ["Progressie kan meer gewicht zijn, maar ook een extra herhaling, een betere uitvoering of dezelfde training met minder moeite.", "Evalueer na enkele weken en verander alleen wat structureel niet werkt."] },
    ],
    takeaway: "Een goed schema geeft richting en blijft flexibel genoeg voor je echte week.",
    relatedHref: "/gratis-persoonlijke-intake",
    relatedLabel: "Bespreek een passend startpunt",
  },
] as const;

export const posts = articles.map((article) => ({
  slug: article.slug,
  category: article.category,
  title: article.title,
  intro: article.intro,
  image: article.image,
  readTime: article.readTime,
}));

export function articleImageSize(src: string): [number, number] {
  if (src.endsWith("community-training.webp")) return [1919, 820];
  if (src.endsWith("hero-coaching.webp")) return [1672, 941];
  if (src.endsWith("absolutely-fit-hero-cable-coaching.png")) return [1672, 941];
  if (src.endsWith("club-exterior.webp")) return [1536, 1152];
  return [1536, 1024];
}
