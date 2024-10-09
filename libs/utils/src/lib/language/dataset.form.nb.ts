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
  },
};
