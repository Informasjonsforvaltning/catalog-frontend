export const datasetFormNb = {
  helptext: {
    title: 'Tittelen skal være kortfattet, kunne stå alene og gi mening. Forkortelser skal skrives helt ut.',
    description:
      'Beskrivelsen skal være kortfattet. Det bør fremgå hvilke opplysninger som utgjør kjernen i datasettet, samt formålet til datasettet.',
    accessRights: `Tilgangsnivå beskriver hvor fritt tilgjengelig datasettet er. Velg det mest restriktive tilgangsnivået som gjelder, basert på om datasettet har:  
      - **Allmenn tilgang**: Tilgjengelig for alle.  
      - **Betinget tilgang**: Tilgang krever oppfyllelse av bestemte betingelser.  
      - **Ikke-allmenn tilgang**: Begrenset til en spesifikk gruppe eller formål.`,
    legalBasis:
      'Relevante juridiske referanser for datasettet, som lover, forskrifter, eller andre rettslige rammer som begrenser eller gir grunnlag for behandling og bruk av datasettet. For eksempel kan dette være en lenke til en lovtekst.',
    legalBasisType: `Velg hvilken type juridisk grunnlag som gjelder for datasettet:

- **Skjermingshjemmel**: Referanse til lov eller forskrift som begrenser deling av datasettet (f.eks. offentlighetsloven, sikkerhetsloven).
- **Behandlingsgrunnlag**: Lov, forskrift, samtykke eller nødvendighetsvurdering som grunnlag for behandling av personopplysninger.
- **Utleveringshjemmel**: Henvisning til lov eller forskrift som gir offentlig virksomhet rett eller plikt til å utlevere opplysninger til private eller juridiske personer.`,
    releaseDate: 'Dato for når innholdet i datasettet ble eller blir tilgjengeliggjort.',
    euTheme:
      'Velg ett eller flere hovedtema som beskriver innholdet i datasettet. Listen er fra EUs kontrollerte vokabular.',
    theme:
      'Velg ett eller flere LOS-temaer som beskriver datasettet. LOS-tema (Livsområdestruktur) er en norsk utvidelse av EUs kontrollerte vokabular for temaer. Dette gjør det mulig å tilpasse kategoriseringen til nasjonale behov.',
    distributionType:
      'En distribusjon beskriver hvordan man får tilgang til datasettet. Eksempeldata er en distribusjon som representerer et utdrag eller en delmengde av datasettet.',
    accessURL:
      'En nettadresse som gir tilgang til datasettet. Lenken kan peke til en ressurs som gir informasjon om hvordan datasettet kan brukes, for eksempel et API, en portal, eller en annen visning av datasettet.',
    downloadURL: 'Direktelenke (URL) til en nedlastbar fil av datasettet.',
    fileType: 'Distribusjonens filformat.',
    mediaType: 'Distribusjonens medietype. Medietype velges fra listen _IANA Media Types_.',
    accessService: 'Datatjenester som gir tilgang til distribusjon av datasettet.',
    license:
      'Lisensen som distribusjonen er gjort tilgjengelig under. Velges fra EUs kontrollerte vokabular _License_.',
    distributionLink: 'Refererer til en side eller et dokument som beskriver distribusjonen.',
    distributionConformsTo: 'En standard eller et etablert skjema som distribusjonen følger.',
    language: 'Språkene innholdet i datasettet er skrevet på.',
    spatial: 'Geografiske områder som er dekket av datasettet.',
    temporal: 'Tidsrommet datasettet dekker dersom det kun har innhold fra visse perioder.',
    lastUpdated: 'Dato for når innholdet i datasettet sist er endret.',
    landingPage:
      'Lenken kan referere til registerets hjemmeside, eller en samleside som beskriver innhold, struktur, tilgang, nedlasting, bruk og/eller søk.',
    type: 'Refererer til EU publication office sine datasett-typer.',
    provenance:
      'Brukes til å referere til beskrivelse av endring i eierskap og forvaltning av datasett (fra det ble skapt) som har betydning for autentisitet, integritet og fortolkning.',
    accrualPeriodicity: 'Hvor ofte datasettet har nytt innhold.',
    modified: 'Dato for siste oppdatering av datasettet.',
    hasCurrentnessAnnotation: 'Avvik eller tilleggsopplysninger om oppdateringsfrekvens.',
    hasCompletenessAnnotation:
      'Dersom datasettet ikke innholder alle objekter som nevnt i formålet, bør det oppgis her.',
    hasAccuracyAnnotation: 'Dersom datasettets innhold ikke er i samsvar med formålet, bør det oppgis her.',
    hasAvailabilityAnnotation:
      'Dersom datasettets tilgangsnivå har avvik eller tilleggsopplysninger, bør det oppgis her.',
    qualifiedAttributions:
      'Innholdsleverandør er en aktør som har en eller annen form for ansvar for datasettet, men som ikke er en utgiver eller produsent. ',
    hasRelevanceAnnotation:
      'Dersom det er bruksområder datasettet er spesielt egnet for eller ikke egnet for, bør det oppgis her.',
    conformsTo:
      'Oppgi om datasettet er i henhold til gitt(e) standard(er), spesifikasjon(er) eller implementasjonsregler.',
    references: 'Et datasett dette datasettet refererer til.',
    inSeries: 'Velg en datasettserie som dette datasettet er en del av.',
    relations: 'Beslektet ressurs, uten nærmere angivelse av type relasjon.',
    informationModelsFromFDK: 'Informasjonsmodell fra felles datakatalog',
    informationModel: 'Informasjonsmodell fra andre kilder',
    contactPoint:
      'Et kontaktpunkt er informasjon om en organisasjon eller enhet som kan kontaktes for spørsmål eller kommentarer om datasettet. Minst ett av feltene må fylles ut for å oppfylle kravet til kontaktpunkt.',
    statusSwitch:
      'Toggelen bestemmer om begrepsbeskrivelsen blir lagret med status “Godkjent” eller som et “Utkast”. Husk å lagre skjemaet for å oppdatere status.',
    keyword:
      'Emneord eller tagger beskriver sentralt innhold i datasettet, spesielt når begrepsdefinisjoner mangler eller når det brukes ord som folk ofte søker etter, men som ikke formelt er knyttet til datasettet.',
    concept:
      'Søk etter begrep som er publisert i Felles begrepskatalog og velg fra nedtrekksliste. Her legger du inn de begrepene som brukes i datasettet. Begrepene brukes til å si noe om hva informasjonen i datasettet betyr. Ved å henvise til gjennomarbeidede definisjoner som virksomheten selv er ansvarlig for å vedlikeholde, sikrer vi at det er tydelig hvordan et begrep brukt i datasettet skal forstås og at denne forståelsen til en hver tid er riktig og oppdatert.',
  },
  heading: {
    about: 'Om datasettet',
    losTheme: 'Tema',
    distributions: 'Distribusjon og eksempeldata',
    details: 'Detaljer om datasett og innhold',
    relations: 'Relasjoner',
    concept: 'Begrep og emneord',
    informationModel: 'I samsvar med informasjonsmodell',
    contactPoint: 'Kontaktpunkt',
  },
  accessRight: {
    public: 'Allmenn tilgang',
    restricted: 'Betinget tilgang',
    nonPublic: 'Ikke-allmenn tilgang',
  },
  fieldLabel: {
    theme: 'Velg LOS-tema(er)',
    euTheme: 'Velg hovedtema(er)',
    concept: 'Legg inn begreper',
    mediaType: 'Mediatyper',
    format: 'Format',
    accessURL: 'Tilgangslenke',
    downloadURL: 'Nedlastingslenke',
    dataset: 'Datasett',
    relationType: 'Relasjonstype',
    datasetSeries: 'Datasettserie',
    choseRelation: 'Velg relasjon',
    conformsTo: 'Standard',
    standard: 'Standard',
    distributionLink: 'Lenke til beskrivelse av distribusjonen',
    license: 'Lisens',
    accessService: 'Tilgangstjeneste',
    legalBasisForRestriction: 'Skjermingshjemmel',
    legalBasisForProcessing: 'Behandlingsgrunnlag',
    legalBasisForAccess: 'Utleveringshjemmel',
    legalBasis: 'Juridisk grunnlag',
    keyword: 'Emneord',
    distribution: 'Distribusjon',
    distributions: 'Distribusjoner',
    releaseDate: 'Utgivelsesdato',
    language: 'Språk',
    spatial: 'Dekningsområde',
    temporal: 'Tidsrom',
    lastUpdated: 'Sist oppdatert',
    landingPage: 'Lenke til mer informasjon om datasettet',
    type: 'Type',
    provenance: 'Opphav',
    accrualPeriodicity: 'Oppdateringsfrekvens',
    modified: 'Sist oppdatert',
    hasCurrentnessAnnotation: 'Aktualitet: Avvik eller tilleggsopplysninger om oppdateringsfrekvens',
    hasCompletenessAnnotation: 'Kompletthet',
    hasAccuracyAnnotation: 'Nøyaktighet',
    hasAvailabilityAnnotation: 'Tilgjengelighet',
    qualifiedAttributions: 'Innholdsleverandører',
    hasRelevanceAnnotation: 'Relevans',
    references: 'Relaterte datasett',
    inSeries: 'Relasjon til datasettserie',
    relations: 'Relaterte ressurser',
    informationModelsFromFDK: 'Informasjonsmodell fra fellesdatakatalog',
    informationModel: 'Informasjonsmodell fra andre kilder',
    sample: 'Eksempeldata',
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
    accessURL: 'Tilgangslenke er påkrevd.',
    contactPoint: 'Minst et kontaktpunkt må fylles ut.',
  },
  button: {
    addDate: 'Legg til tidsperiode',
    addInformationModel: 'Legg til informasjonsmodell',
    addStandard: 'Legg til standard',
    addDistribution: 'Legg til distribusjon',
    updateDistribution: 'Oppdater distribusjon',
    update: 'Oppdater',
  },
  errors: {
    qualifiedAttributions: 'Kunne ikke hente enheter.',
  },
};
