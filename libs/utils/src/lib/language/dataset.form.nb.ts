export const datasetFormNb = {
  helptext: {
    accessRights: 'Skal gjenspeile det mest begrensede feltet/opplysningen i datasettet.',
    title: 'Tittelen skal være kortfattet, kunne stå alene og gi mening. Forkortelser skal skrives helt ut.',
    description:
      'Beskrivelsen skal være kortfattet. Det bør fremgå hvilke opplysninger som utgjør kjernen i datasettet, samt formålet til datasettet.',
    landingPage:
      'Lenken kan referere til registerets hjemmeside, eller en samleside som beskriver innhold, struktur, tilgang, nedlasting, bruk og/eller søk.',
    legalBasisForRestriction: 'Angi referanse til relevant lov eller forskrift. Helst til lovdata på paragrafnivå.',
    legalBasisForProcessing: 'Angi referanse til relevant lov eller forskrift, samtykke eller nødvendighetsvurdering.',
    legalBasisForAccess: 'Angi referanse til relevant lov eller forskrift. Helst til lovdata på paragrafnivå.',
    theme: 'Velg tema(er) som beskriver inneholdet i datasettet.',
    parentTheme: 'Overordnet tema',
    type: 'Refererer til EU publication office sine datasett-typer.',
    concept: 'Referanse til sentrale begrep som er viktige for å forstå og tolke datasettet.',
    keyword: 'Inneholder emneord (eller tag) som beskriver datasettet.',
    seachConcept: 'Søk etter begrep...',
    provenance: 'Hvor opplysningene er hentet fra.',
    frequency: 'Hvor ofte datasettet har nytt innhold.',
    lastUpdated: 'Dato for når innholdet i datasettet sist er endret.',
    actuality: 'Avvik eller tilleggsopplysninger om oppdateringsfrekvens',
    standard:
      'Oppgi om datasettet er i henhold til gitt(e) standard(er), spesifikasjon(er) eller implementasjonsregler.',
    content: 'Innhold',
    relevance: 'Dersom det er bruksområder datasettet er spesielt egnet for eller ikke egnet for, bør det oppgis her.',
    completeness: 'Dersom datasettet ikke innholder alle objekter som nevnt i formålet, bør det oppgis her.',
    accuracy: 'Dersom datasettets innhold ikke er i samsvar med formålet, bør det oppgis her.',
    availability: 'Dersom datasettets tilgangsnivå har avvik eller tilleggsopplysninger, bør det oppgis her.',
    spatial: 'Søk etter geografisk område fra Administrative enheter (Kartverket) og velg fra nedtrekksliste.',
    temporal: 'Tidsrommet datasettet dekker dersom det kun har innhold fra visse perioder',
    releaseDate: 'Når innholdet i datasettet ble/blir tilgjengeliggjort',
    language: 'Hovedspråket innholdet i datasettet er skrevet på.',
  },
  heading: {
    description: 'Beskrivelse av datasettet',
    landingPage: 'Lenke til mer informasjon om datasettet',
    titleAndDescription: 'Tittel og beskrivelse',
    accessRights: 'Tilgangsnivå',
    legalBasisForRestriction: 'Skjermingshjemmel',
    legalBasisForProcessing: 'Behandlingsgrunnlag',
    legalBasisForAccess: 'Utleveringshjemmel',
    losTheme: 'LOS-tema og emner',
    euTheme: 'EU-tema',
    concept: 'Begrep og emneord',
    provenanceAndFrequency: 'Opphav og ferskhet',
    provenance: 'Opphav',
    frequency: 'Oppdateringsfrekvens',
    lastUpdated: 'Sist oppdatert',
    actuality: 'Aktualitet',
    standard: 'Standard',
    content: 'Innhold',
    relevance: 'Relevans',
    completeness: 'Kompletthet',
    accuracy: 'Nøyaktighet',
    availability: 'Tilgjengelighet',
    geography: 'Geografi, tid og språk',
    spatial: 'Geografisk avgrensning',
    temporal: 'Tidsmessig avgrenset til',
    releaseDate: 'Utgivelsesdato',
    language: 'Språk',
  },
  accessRight: {
    public: 'Allmenn tilgang',
    restricted: 'Betinget tilgang',
    nonPublic: 'Ikke-allmenn tilgang',
  },
  fieldLabel: {
    description: 'Beskrivelse av datasettet (Norsk bokmål)',
    title: 'Tittel (Norsk bokmål)',
    losTheme: 'Velg tema, kategorier og emner',
    euTheme: 'Velg EU-tema(er)',
    type: 'Velg type',
    concept: 'Legg inn begreper',
    keyword: { nb: 'Emneord (norsk bokmål)', nn: 'Emneord (norsk nynorsk)', en: 'Emneord (engelsk)' },
    geography: 'Søk ettet geografisk område',
  },
  alert: {
    confirmDelete: 'Er du sikker på at du vil slette datasettbeskrivelsen?',
    formError: 'Du har feil i skjemaet. Rett opp i disse før du kan lagre.',
  },
  validation: {
    title: 'Tittelen må være minst 3 karakterer lang.',
    titleRequired: 'Tittel er påkrevd.',
    descriptionRequired: 'Beskrivelse er påkrevd.',
    description: 'Beskrivelsen må være minst 5 karakterer lang.',
    url: `Ugyldig lenke. Vennligst sørg for at lenken starter med ‘https://’ og inneholder et gyldig toppdomene (f.eks. ‘.no’).`,
    euTheme: 'Minst ett EU-tema må være valgt.',
    searchString: 'Ingen treff. Søkestrengen må inneholde minst to bokstaver.',
  },
};
