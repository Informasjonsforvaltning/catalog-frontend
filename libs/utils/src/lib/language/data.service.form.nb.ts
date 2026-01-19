export const dataServiceFormNb = {
  helptext: {
    title:
      "Tittelen skal være kortfattet, kunne stå alene og gi mening. Forkortelser skal skrives helt ut.",
    description:
      "Beskrivelsen skal være kortfattet. Det bør fremgå hva som er formålet til API-et.",
    endpoint: "Rotplassering eller primært endepunkt for API-et.",
    endpointDescriptions:
      "Legg til lenke til spesifikasjon av API-et. F.eks OAS, Swagger, GraphQL eller lignende.",
    accessRights: `Informasjon angående tilgang eller begrensninger basert på personvern, sikkerhet eller andre retningslinjer. Velg det mest restriktive tilgangsnivået som gjelder:
      - **Allmenn tilgang**: Tilgjengelig for alle.
      - **Betinget tilgang**: Tilgang krever oppfyllelse av bestemte betingelser.
      - **Ikke-allmenn tilgang**: Begrenset til en spesifikk gruppe eller formål.`,
    contactName: "Brukes til å oppgi navnet til kontaktpunktet.",
    contactFields:
      "Informasjon om en organisasjon eller enhet som kan kontaktes for spørsmål eller kommentarer om datasettet. Minst ett av feltene må fylles ut for å oppfylle kravet til kontaktpunkt.",
    format:
      "Brukes til å spesifisere strukturen som kan returneres av spørring mot endepunktsURL, verdien skal velges fra EUs kontrollerte vokabular _File type_.",
    landingPage:
      "Referanse til nettside som gir tilgang til API-et og/eller tilleggsinformasjon",
    pages: "Referanser til sider og/eller dokumenter som beskriver API-et",
    license:
      "Lisensen som API-et er gjort tilgjengelig under. Velges fra EUs kontrollerte vokabular _License_.",
    status:
      "Brukes til å oppgi tjenestens modenhet, velges fra EU’s kontrollerte vokabular _Distribution status_.",
    keywords:
      "Oppgi emneord (eller tag) som beskriver datatjenesten, f.eks. _eksempel_, _datatjeneste_ (bokmål) / _example_, _data service_ (Engelsk).",
    servesDataset:
      "Brukes til å referere til datasett som datatjenesten kan distribuere.",
    availability:
      "Brukes til å angi hvor lenge det er planlagt å holde datatjenesten tilgjengelig, verdien velges fra EU’s kontrollerte vokabular _Planned availability_.",
    costs:
      "Brukes til å oppgi prisinfomasjonen og utrekningsgrunnlaget for ett eller flere gebyr for bruk av APIet.",
    costDescription: "Brukes til å oppgi en tekstlig beskrivelse av gebyret.",
    costDocumentation:
      "Brukes til å referere til en side eller et dokument som beskriver prismodell/beregningsgrunnlag. I tillegg til å dokumentere beregningsgrunnlaget, kan denne egenskapen brukes i tilfeller der det ikke bare er ett beløp, men en komplisert prismodell avhengig av f.eks. mengde data, hyppighet av oppslag/nedlasting osv. Selv om hverken beløp eller dokumentasjon er obligatorisk, SKAL minst én av dem brukes.",
    costValue:
      "Brukes til å oppgi gebyrbeløpet. Selv om hverken beløp eller dokumentasjon er obligatorisk, SKAL minst én av dem brukes. Valutaverdien velges fra EUs kontrollerte vokabular _Valuta_.",
    publish:
      "Publiser API-beskrivelsen til Data.norge.no. For å publisere må du fylle ut alle påkrevde felt i skjemaet, en beskrivelse kan ikke slettes så lenge den er publisert.",
  },
  heading: {
    about: "Om API-et",
    endpoint: "Endepunkt",
    contactPoint: "Kontaktpunkt",
    format: "Format",
    access: "Krav til bruk",
    dataset: "Tilgjengeliggjør datasett",
    documentation: "Dokumentasjon",
    status: "Status",
  },
  subtitle: {
    about: "Nøkkelinformasjon om APIet.",
    endpoint: "Endepunktet til APIet og tilhørende beskrivelse.",
    contactPoint:
      "Kontaktinformasjonen til den delen av virksomheten som har ansvar for API-beskrivelsen. Det skal ikke oppgis personlig kontaktinformasjon.",
    format: "Søk på og velg blant registrerte filtyper.",
    access:
      "Bruksvilkår forklart med lisensalternativer tilgangsnivåer og kostnadsdetaljer.",
    dataset: "Datasett som kan distribueres av datatjenesten.",
    documentation: "Landingsside og annen viktig dokumentasjon for API-et.",
    status: "Statusinformasjon for tjenestens modenhet og tilgjengelighet.",
  },
  fieldLabel: {
    description: "Beskrivelse av API-et",
    title: "Tittel",
    endpoint: "EndepunktsURL",
    endpointDescriptions: "Endepunktsbeskrivelse",
    accessRights: "Tilgangsrettigheter",
    format: "Format",
    landingPage: "Landingsside",
    servesDataset: "Datasett",
    pages: "Annen dokumentasjon",
    license: "Lisens",
    status: "Status",
    keywords: "Emneord",
    availability: "Tilgjengelighet",
    costs: "Gebyr",
    costDocumentation: "Dokumentasjon",
    costValue: "Beløp",
    dataServiceID: "API-ID",
    modified: "Sist oppdatert",
    contactName: "Navn",
    contactFields: "Kontaktinformasjon",
    ignoreRequired: "Ignorer påkrevde felt",
  },
  validation: {
    costValueRequiredWhenMissingDoc:
      "Beløp er påkrevd når ingen dokumentasjon er oppgitt.",
  },
  alert: {
    confirmDelete: "Er du sikker på at du vil slette API-beskrivelsen?",
    confirmPublish: "Er du sikker på at du vil publisere API-beskrivelsen?",
    confirmUnpublish: "Er du sikker på at du vil avpublisere API-beskrivelsen?",
    ignoreRequired:
      "I utgangspunktet er det krav om at alle påkrevde felt må fylles ut for å få lagret. Når avhukingsboksen er aktiv, må bare Tittel på bokmål være fylt ut.",
    titleNotDefined: "Tittel ikke definert",
  },
  button: {
    update: "Oppdater",
  },
  noLicense: "Ingen lisens valgt",
  noStatus: "Ingen status valgt",
  noAvailability: "Ingen tilgjengelighet valgt",
};
