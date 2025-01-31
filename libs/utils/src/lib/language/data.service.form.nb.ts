export const dataServiceFormNb = {
  helptext: {
    title: 'Tittelen skal være kortfattet, kunne stå alene og gi mening. Forkortelser skal skrives helt ut.',
    description: 'Beskrivelsen skal være kortfattet. Det bør fremgå hva som er formålet til APIet.',
    endpoint: 'Rotplassering eller primært endepunkt for APIet.',
    endpointDescriptions: 'Legg til lenke til spesifikasjon av APIet. F.eks OAS, Swagger, GraphQL eller lignende.',
    accessRights: `Informasjon angående tilgang eller begrensninger basert på personvern, sikkerhet eller andre retningslinjer. Velg det mest restriktive tilgangsnivået som gjelder:
      - **Allmenn tilgang**: Tilgjengelig for alle.
      - **Betinget tilgang**: Tilgang krever oppfyllelse av bestemte betingelser.
      - **Ikke-allmenn tilgang**: Begrenset til en spesifikk gruppe eller formål.`,
    contactPoint:
      'Et kontaktpunkt er informasjon om en organisasjon eller enhet som kan kontaktes for spørsmål eller kommentarer om datasettet. Minst ett av feltene må fylles ut for å oppfylle kravet til kontaktpunkt.',
    mediaTypes: 'Søk på og velg blant registrerte medietyper.',
    fileTypes: 'Søk på og velg blant registrerte filtyper.',
    landingPage: 'Referanse til nettside som gir tilgang til APIet og/eller tilleggsinformasjon',
    pages: 'Referanser til sider og/eller dokumenter som beskriver APIet',
    license: 'Lisensen som APIet er gjort tilgjengelig under. Velges fra EUs kontrollerte vokabular _License_.',
    status: 'Brukes til å oppgi tjenestens modenhet, velges fra EU’s kontrollerte vokabular _Distribution status_.',
    servesDataset: 'Legg til en eller flere datasettbeskrivelse(r) som er tilknyttet APIet.',
    keywords:
      'Oppgi emneord (eller tag) som beskriver datatjenesten, f.eks. «eksempel», «datatjeneste» (bokmål) / "example", "data service" (Engelsk).',
    availability:
      'Brukes til å angi hvor lenge det er planlagt å holde datatjenesten tilgjengelig, verdien velges fra EU’s kontrollerte vokabular _Planned availability_.',
    versions: 'Brukes til å oppgi et versjonsnummer eller annen versjonsbetegnelse for APIet.',
  },
  heading: {
    about: 'Om APIet',
    endpoint: 'Endepunkt',
    contactPoint: 'Kontaktpunkt',
    format: 'Format',
    details: 'Detaljer',
    dataset: 'Tilknyttede datasettbeskrivelser',
    keywords: 'Emneord',
    versions: 'Versjoner',
  },
  fieldLabel: {
    description: 'Beskrivelse av APIet',
    title: 'Tittel',
    endpoint: 'EndepunktURL',
    endpointDescriptions: 'Endepunktsbeskrivelse',
    accessRights: 'Tilgangsrettigheter',
    mediaTypes: 'Medietyper',
    fileTypes: 'Filtyper',
    landingPage: 'Landingsside',
    pages: 'Annen dokumentasjon',
    license: 'Lisens',
    status: 'Status',
    servesDataset: 'Søk etter og velg datasettbeskrivelse(r)',
    keywords: 'Emneord',
    availability: 'Tilgjengelighet',
    versions: 'Versjonsbetegnelse',
  },
  alert: {
    confirmDelete: 'Er du sikker på at du vil slette API-beskrivelsen?',
  },
  noLicense: 'Ingen lisens valgt',
  noStatus: 'Ingen status valgt',
  noAvailability: 'Ingen tilgjengelighet valgt',
};
