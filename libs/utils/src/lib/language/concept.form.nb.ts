export const conceptFormNb = {
  helpText: {
    abbreviation: `
Forkortelse som brukes som kortform for anbefalt term for begrepet.`,
    altLabel: `
Andre termer som kan brukes om begrepet. Typiske eksempler er synonymer.

En term skal i sin helhet skrives med små bokstaver, med unntak for egennavn. En term skal beskrives i ubestemt form entall, med mindre 
begrepet som defineres betegnes med et flertallsord (f.eks. finansielle midler) eller det er særskilte grunner til å uttrykke termen i bestemt form.`,
    assignedUser: `Personen som skal ha ansvaret for å følge opp begrepet.`,
    hiddenLabel: `
Termer som ikke ønskes brukt om begrepet.

En term skal i sin helhet skrives med små bokstaver, med unntak for egennavn. En term skal beskrives i ubestemt form entall, med mindre begrepet som 
defineres betegnes med et flertallsord (f.eks finansielle midler) eller det er særskilte grunner til å uttrykke termen i bestemt form.`,
    definition: `
Definisjonen kan utformes for ulike målgrupper, men meningsinnholdet må være det samme. Det skal være minimum én definisjon, og maksimum én per skriftspråk og målgruppe.

- __Uten målgruppe:__ Definisjonen er ikke tilpasset noen spesiell målgruppe. 
- __Spesialister:__ Definisjonen er tilpasset personer med et visst kunnskapsnivå innen aktuelt fagområde.
- __Allmenheten:__ Definisjonen er tilpasset for en bredere gruppe, og skal være lett å forstå for folk uten forkunnskaper innen aktuelt fagområde.`,
    
    definitionText: {
      definisjon:`
Definisjonen skal være en kort og presis forklaring av begrepet. Den skal være tydelig og lett å forstå, og skal i sin helhet skrives med små bokstaver, 
med unntak for egennavn.

Definisjonen skal definere begrepet uten å bruke begrepet selv. Det kan være lurt å teste den i en setning, da den skal kunne erstatte termen uten at betydningen endres.
Definisjonen skal skille begrepet fra andre begreper, ikke bare gi eksempler. Et spesialisert begrep beskrives ved å inkludere overordnet begrep og spesifikke kjennetegn 
som skiller begrepet fra andre. Tilleggsinformasjon kan legges i merknadsfeltet, og skal ikke være del av selve definisjonen.`,
      definisjonForSpesialister: `
Definisjonen skal være kort og utformes slik at den gir nok informasjon til en spesialist innenfor faget.

Definisjonen skal definere begrepet uten å bruke begrepet selv. Det kan være lurt å teste den i en setning, da den skal kunne erstatte termen uten at betydningen endres.
Definisjonen skal skille begrepet fra andre begreper, ikke bare gi eksempler. Et spesialisert begrep beskrives ved å inkludere overordnet begrep og spesifikke kjennetegn 
som skiller begrepet fra andre. Tilleggsinformasjon kan legges i merknadsfeltet, og skal ikke være del av selve definisjonen.`,
      definisjonForAllmennheten: `
Definisjonen skal være kort og utformes slik at det er lett for en uten forkunnskaper å forstå hva begrepet representerer. Definisjonen bør skrives i klarspråk, 
og forkortelser og fagspesifikke uttrykk skal unngås.

Definisjonen skal definere begrepet uten å bruke begrepet selv. Det kan være lurt å teste den i en setning, da den skal kunne erstatte termen uten at betydningen endres.
Definisjonen skal skille begrepet fra andre begreper, ikke bare gi eksempler. Et spesialisert begrep beskrives ved å inkludere overordnet begrep og spesifikke kjennetegn 
som skiller begrepet fra andre. Tilleggsinformasjon kan legges i merknadsfeltet, og skal ikke være del av selve definisjonen.`,
    },
    devisionCriterion: {
      generisk: `
Inndelingskriterium beskriver hva relasjonsinndelingen bygger på, f.eks.: kjennetegn som en bestemt egenskap, struktur, oppbygging, varighet e.l.

Eksempler:

- _Tilkopling til datamaskin blir brukt som inndelingskriterium for å dele det overordnede begrepet datamus i spesifikke begreper som kablet mus og trådløs mus._
- _Geometrisk form blir brukt som inndelingskriterium for å dele det overordnede begrepet sikkerhetsskilt i spesifikke begreper som skilt for obligatorisk handling og skilt for sikkert forhold._`,
      partitiv: `
Inndelingskriterium beskriver hva relasjonsinndelingen bygger på, f.eks.: kjennetegn som en bestemt egenskap, struktur, oppbygging, varighet e.l.

Eksempler:

- _Funksjon blir brukt som inndelingskriterium for å dele helhetsbegrepet datamaskin i delbegreper som hovedkort, visningsenhet, strømforsyning, lagringsenhet og inndataenhet._`
    }, 

    contactInfo: `Det er mulig å legge til e-post og telefonnummer som kontaktinformasjon. Minst en av disse må fylles ut.`,
    labels: `
Ord eller uttrykk som brukes for å gruppere begrep når dette er hensiktsmessig for virksomheten. Merkelapp kan brukes som et filter for å finne begrep som hører sammen.`,
    period: `
__Gyldig fra og med__ brukes når et begrep er gjeldende fra en gitt dato. Dersom begrepet ikke er gjeldende ved publiserings- eller registreringsdato, settes denne datoen frem i tid til den datoen begrepet skal gjelde fra.

__Gyldig til og med__ brukes når et begrep ikke lenger skal brukes etter en gitt dato. Dersom et annet begrep skal brukes i stedet, 
bør det legges til en erstattet av relasjon som peker på det nye begrepet.    `,
    prefLabel: `
Termen som blir ansett som best egnet for begrepet. Anbefalt term skal finnes på både bokmål og nynorsk.

En term skal i sin helhet skrives med små bokstaver, med unntak for egennavn. En term skal beskrives i ubestemt form entall, 
med mindre begrepet som defineres betegnes med et flertallsord (f.eks. finansielle midler) eller det er særskilte grunner til å uttrykke termen i bestemt form.`,
    valueRange: `
Verdiområde kan oppgis som tekst og/eller lenke til der dette er spesifisert.

Eksempler:
et intervall (min-maks).`,
    relation: `
Det finnes flere typer relasjoner. __Se også__ og __Erstattes av__ er direkte relasjoner uten mulighet for å utdype videre. 
I tillegg finnes det tre mer uttrykksfulle relasjonstyper, som er Generisk, Partitiv og Assosiativ.

__Generisk:__ Relasjon som beskriver begrepenes hierarkiske forhold til hverandre.

__Partitiv:__ Relasjon som beskriver begrepenes helhets- og delforhold til hverandre.

__Assosiativ:__ Relasjon som beskriver ikke-hierarkiske forhold mellom begrepene. Relasjonen kan spesifiseres ytterligere ved bruk av relasjonsrolle.
`,
    relationLevel: {
      generisk: `
__Overordnet__: Begrepet som redigeres er overordnet begrepet som det relateres til.

__Underordnet__: Begrepet som redigeres er underordnet begrepet som det relateres til.    
`,
      partitiv: `
__Er del av__: Begrepet som redigeres er del av begrepet det relateres til.

__Omfatter__: Begrepet som redigeres omfatter begrepet det relateres til.
`,
    },
    relationRole: `
Relasjonsrollen begrepet som redigeres har overfor begrepet som det relateres til. 

Eksempler: _har nært samsvar med, har eksakt samsvar med, muliggjør_.`,
    relatedConcept: `
Først må det velges katalog for begrepet.

__Virksomhetens eget begrep:__ Alle virksomhetens begrep i registreringsløsningen, uavhengig av publiseringstilstand.

__Publisert begrep på data.norge.no:__ Alle publiserte begrep, inklusiv virksomhetens egne.

__Begrep i annen begrepskatalog:__ Gyldig URI for begrep i en annen katalog utenfor data.norge.no. Begrepet må være 
tilgjengelig som lenkede data (RDF), i henhold til SKOS-AP-NO.

Etter katalog er valgt, brukes feltet nedenfor til å enten søke i katalogen som er valgt eller skrive inn en URI for begrep i annen katalog`,
    relationToSource: `
__Egendefinert:__ Definisjonen er ikke er hentet fra noen eksterne kilder.

__Basert på kilde:__ Definisjonen bygger på en eller flere gitte kilder.

__Sitat fra kilde:__ Definisjonen er en ordrett gjengivelse fra en gitt kilde.`,
    sources: `Du må ha minst én kilde, som kan bestå av en kildebeskrivelse, en URI, eller begge deler.`,
    status: `
Virksomheten skal ha egne rutiner på hvilke statuser som skal brukes og hva som er kriteriene for å sette de ulike statusene. Begrepsstatus er basert på EUs 
kontrollerte vokabular [Concept status](https://op.europa.eu/en/web/eu-vocabularies/concept-scheme/-/resource?uri=http://publications.europa.eu/resource/authority/concept-status).`,
    subjectFree: `
Fagområde kan beskrives fritt og kan representere en akademisk disiplin, et bruksområde, et produkt, en tjenestekjede eller lignende. Fagområde bør oppgis på flere språk når dette er mulig. Et begrep kan grupperes under flere fagområder.

Hvis virksomheten ønsker å bruke kodeliste til å beskrive fagområde i stedet for fritekst, kan noen i virksomheten som har rollen virksomhetsadministrator legge til dette i administrasjonsgrensesnittet.`,
    subjectCodeList: `
Fagområde velges fra en forhåndsdefinert kodeliste forvaltet av virksomheten. Et begrep kan grupperes under flere fagområder.

Hvis det er behov for flere koder eller endringer i listen, kan dette endres av noen i virksomheten som har rollen virksomhetsadministrator. Kodene i kodelisten kan oversettes til flere språk, dette gjøres av virksomhetsadministrator.`,
    versionNumber: `
Versjonsnummeret følger formatet 'major.minor.patch', hvor:
- __Major__ økes ved store endringer som ikke er bakoverkompatible.
- __Minor__ økes ved nye funksjoner eller forbedringer som er bakoverkompatible.
- __Patch__ økes ved feilrettinger og mindre justeringer.

Eksempel: Versjon 2.1.3 betyr andre hovedversjon, første mindre oppdatering, og tredje feilretting.`,
    versionNote: 'Egenskapen brukes til å oppgi versjonsnoter til en versjon av et begrep. Egenskapen bør gjentas når teksten finnes på flere skriftspråk.'
  },
  section: {
    termTitle: 'Term',
    termSubtitle: 'Termer er ord eller uttrykk som setter navn på begreper.',
    definitionTitle: 'Definisjon',
    definitionSubtitle: 'Definisjoner er utsagn som tydelig beskriver meningsinnholdet i et begrep i et gitt fagområde.',
    remarkTitle: 'Merknad',
    remarkSubtitle: 'Tilleggsopplysninger som tydeliggjør betydningen og bruken av begrepet.',
    relationTitle: 'Relasjoner',
    relationSubtitle: 'Relasjoner til andre begrep.',
    subjectTitle: 'Fagområde',
    subjectSubtitle: 'Spesialisert kunnskapsområde som begrepet grupperes under.',
    exampleTitle: 'Eksempel',
    exampleSubtitle: 'Eksempler på forekomster av begrepet.',
    valueRangeTitle: 'Verdiområde',
    valueRangeSubtitle: '',
    internalTitle: 'Interne opplysninger',
    internalSubtitle: 'Opplysningene under er til intern bruk og vil ikke publiseres ut til Data.norge.no. Interne felt kan legges til og redigeres i administrasjonsgrensesnittet.',
    contactTitle: 'Kontaktinformasjon',
    contactSubtitle: 'Kontaktinformasjonen til den delen av virksomheten som har ansvar for begrepsbeskrivelsen. Det skal ikke oppgis personlig kontaktinformasjon.',
    conceptStatusTitle: 'Begrepsstatus',
    conceptStatusSubtitle: 'Gjeldende status for begrepet.',
    periodTitle: 'Gyldighetsperiode',
    periodSubtitle: 'Datoene begrepet skal gjelde fra og med og/eller til og med.',
    versionTitle: 'Versjon',
    versionSubtitle: 'En versjon representerer en spesifikk utgave eller oppdatering av et begrep, som reflekterer eventuelle endringer i definisjon, kontekst eller bruk over tid.'
  },  
  fieldLabel: {
    abbreviationLabel: 'Forkortelse',
    assignedUser: 'Hvem skal begrepet tildeles?',
    prefLabel: 'Anbefalt term',
    altLabel: 'Tillatt term',
    hiddenLabel: 'Frarådet term',
    subjectFree: 'Fagområde (beskriv fritt)',
    subjectCodeList: 'Fagområde (velg fra liste)',
    remark: 'Merknad',
    example: 'Eksempel',
    description: 'Beskrivelse',
    status: 'Begrepsstatus',
    versionNote: 'Versjonsnote',
    definition: 'Definisjon',
    definitionTargetGroup: {
      definisjon: 'Uten målgruppe',
      definisjonForAllmennheten: 'Allmennheten', 
      definisjonForSpesialister: 'Spesialister'
    },
    definitionTargetGroupFull: {
      definisjon: 'Definisjon (uten målgruppe)',
      definisjonForAllmennheten: 'Definisjon for allmennheten', 
      definisjonForSpesialister: 'Definisjon for spesialister'
    },
    relationToSource: 'Forhold til kilde',
    sources: 'Kilder',
    source: 'Kilde',
    relation: 'Relasjon',
    relationLevel: 'Nivå',
    relationRole: 'Relasjonsrolle',
    relationTypes: {
      assosiativ: 'Assosiativ',
      generisk: 'Generisk',
      partitiv: 'Partitiv',
      seOgså: 'Se også',
      erstattesAv: 'Erstattes av',
    },
    relationSubtypes: {
      overordnet: 'Overordnet',
      underordnet: 'Underordnet',
      erDelAv: 'Er del av',
      omfatter: 'Omfatter',
      none: 'Ingen nivå valgt'
    },
    relatedConceptTypes: {
      internal: 'Virksomhetens eget begrep',
      external :'Publisert begrep på data.norge.no',
      custom: 'Begrep i en annen begrepskatalog'
    },
    relatedConcept: 'Relatert begrep',
    internalConcept: 'Internt begrep',
    ignoreRequired: 'Ignorer påkrevde felt',
    divisionCriterion: 'Inndelingskriterium',
    contactInfo: 'Kontaktinformasjon',
    emailAddress: 'E-postadresse',
    phoneNumber: 'Telefonnummer',
    contactForm: 'Kontaktskjema',
    versionNumber: 'Versjonsnummer',
    labels: 'Merkelapp',
    valueRangeDescription: 'Beskrivelse',
    valueRangeLink: 'Lenke til referanse',
    period: 'Gyldighetsperiode'
  },
  alert: {
    confirmDelete: 'Er du sikker på at du vil slette datasettbeskrivelsen?',
    formError: 'Du har feil i skjemaet. Rett opp i disse før du kan lagre.',
    warning: 'Advarsel',
    codeListToText: 'Virksomheten har byttet fra kodeliste til fritekst. Tidligere kodeliste verdier må slettes for å kunne lagre begrepet.',
    textToCodeList: 'Virksomheten har byttet fra fritekst til kodeliste. Tidligere fritekst verdier må slettes for å kunne lagre begrepet.',
    ignoreRequired: 'I utgangspunktet er det krav om at alle påkrevde felt må fylles ut for å få lagret. Når avhukingsboksen er aktiv, må bare Anbefalt term på bokmål være fylt ut.',
    youHaveUnsavedChanges: 'Det finnes endringer som ikke har blitt lagret på begrepet:',
    wantToRestoreChanges: 'Vil du gjenopprette?',
    termNotDefined: 'Term ikke oppgitt'
  },
  validation: {
    minLength: 'Verdien må være minst {0} karakterer lang.',
    required: 'Feltet må fylles ut.',
    invalidUrl: `Ugyldig lenke. Vennligst sørg for at lenken starter med ‘https://’ og inneholder et gyldig toppdomene (f.eks. ‘.no’).`,
    minOneSource: 'Du må ha minst en kilde',
    version: 'Versjon må være større en v{min}',
    languageRequired: '{label} ({language}) er påkrevd',
    date: 'Dato er ikke gyldig',
    subjectConflict: 'Det er ikke tillatt å ha både fagområde som fritekst og kodeliste.'
  },
  
};
