export const datasetFormNb = {
  helptext: {
    title:
      "Tittelen gir andre et førsteinntrykk av datasettet, derfor er det viktig at denne er presist og forståelig formulert. Den skal kunne forstås av folk flest, derfor bør interne formuleringer og forkortelser unngås. For at datasettet skal bli lettere å finne, oppgi tittelen på flere språk.",
    description:
      "Kort og presis beskrivelse av datasettet. Dette gir brukeren innsikt i hvilke data man kan forvente å finne i datasettet. Beskrivelsen skal ikke inneholde informasjon som kan oppgis i andre felter i dette skjemaet.",
    accessRights: `Hvem som har tilgang til datasettet. 
- **Allmenn tilgang**: datasettet er tilgjengelig for alle. Må ha minst én distribusjon med åpen lisens for å regnes som åpne data.
- **Betinget tilgang**: datasettet er kun tilgjengelig under visse betingelser fastsatt.
- **Ikke-allmenn tilgang**: tilgang til datasettet er begrenset av lovregulerte hensyn knyttet til sikkerhet, personvern eller lignende.

Dersom flere tilgangstyper kan passe, velg den mest restriktive.

[Mer informasjon om tilgangsnivå](https://data.norge.no/nb/docs/finding-data/access-data)`,
    legalBasisForRestriction:
      "Begrensning av deling av datasett. Refererer til lov eller forskrift (f.eks. offentlighetsloven, sikkerhetsloven). Relevant for datasett med betinget eller ikke-allmenn tilgangsnivå.",
    legalBasisForProcessing:
      "Behandling av personopplysninger. Refererer til lov eller forskrift (f.eks. GDPR). Relevant for datasett med betinget eller ikke-allmenn tilgangsnivå.",
    legalBasisForAccess:
      "Utlevering av opplysninger til private eller juridiske personer. Refererer til lov eller forskrift. Relevant for alle tilgangsnivå.",
    issued:
      "Første gang datasettet ble (eller blir) tilgjengeliggjort. Dette er uavhengig av når denne beskrivelsen ble opprettet.",
    euDataTheme:
      "Overordnede hovedtema for datasettet. Listen er fra [EUs kontrollerte vokabular](https://op.europa.eu/en/web/eu-vocabularies/concept-scheme/-/resource?uri=http://publications.europa.eu/resource/authority/data-theme).",
    losTheme:
      "Tema som beskriver datasettet på et mer detaljert nivå. Listen er fra [LOS](https://psi.norge.no/los/struktur.html), et felles vokabular som er temainndelt for å kategorisere og beskrive offentlige tjenester og ressurser i Norge. Velg det eller de mest presise temaene som er dekkende for innholdet i datasettet.",
    distribution:
      "Distribusjonen skal gi tilgang til hele datasettet. Hvis distribusjonen gir tilgang til en egen delmengde av datasettet skal dette beskrives som et eget datasett. Det skal opprettes en distribusjon for hvert format.",
    distributionTitle:
      "Kortfattet navn på distribusjonen. Navnet skal kunne stå alene og gi mening. Forkortelser skal skrives helt ut. Oppgi for hvert språk distribusjonen tilbys.",
    distributionDescription:
      "Kortfattet beskrivelse av distribusjonen. Oppgi for hvert språk distribusjonen tilbys. Beskrivelsen skal ikke inneholde informasjon som kan oppgis i andre felter i dette skjemaet.",
    sample:
      "En smakebit av datasettet (skarpe eller syntetiske data) som gir andre et innblikk i hva de kan forvente å finne i datasettet.",
    accessURL: `En nettadresse hvor man kan få tilgang til datasettet. Adressen kan enten vise til en side hvor man kan laste ned datasettet direkte, eller til en side som gir informasjon om hvordan datasettet kan brukes, for eksempel et API, en portal, eller en annen visning av datasettet.

Dersom dette er en lenke hvor datasettet lastes ned direkte, og datasettet ikke tilbyr noen annen form for distribusjon: legg inn lenken i dette feltet, legg til feltet 'nedlastingslenke' i tillegg, og fyll inn samme lenke her.`,
    downloadURL: "Direktelenke (URL) til en nedlastbar fil av datasettet.",
    fileType:
      "Filtypen til distribusjonen. Velges fra EU’s kontrollerte vokabular [file type](https://op.europa.eu/en/web/eu-vocabularies/concept-scheme/-/resource?uri=http://publications.europa.eu/resource/authority/file-type)",
    mediaType:
      "Innholdets spesifikke type. Medietype velges fra listen [IANA Media Types](https://www.iana.org/assignments/media-types/media-types.xhtml).",
    accessServices:
      "En datatjeneste hvor man kan skaffe tilgang til datasettet, for eksempel for datasett med begrenset tilgangsnivå.",
    license:
      "Lisensen denne distribusjonen kan tas i bruk under. Angir vilkår for tilgang, bruk og deling. Velges fra EUs kontrollerte vokabular [License](https://op.europa.eu/en/web/eu-vocabularies/concept-scheme/-/resource?uri=http://publications.europa.eu/resource/authority/licence).",
    page: "Lenker til en side eller et dokument som beskriver distribusjonen.",
    distributionConformsTo:
      "Lenke til en standard, spesifikasjon eller et etablert skjema som distribusjonen er i samsvar med.",
    language: "Alle språk innholdet i datasettet er tilgjengelig på.",
    spatial: "Geografiske områder datasettet dekker.",
    temporal:
      "Tidsperiode(r) datasettet dekker. En tidsperiode kan være pågående.",
    lastUpdated: "Dato for siste oppdatering av innholdet i datasettet.",
    landingPage:
      "Lenke til en nettside som gir tilgang til datasettet, dets distribusjoner og/eller tilleggsinformasjon.",
    type: "Datasettets spesifikke type. Dette kan velges blant EU’s kontrollerte vokabular [dataset type](https://op.europa.eu/en/web/eu-vocabularies/concept-scheme/-/resource?uri=http://publications.europa.eu/resource/authority/dataset-type).",
    provenance:
      "Endringer i eierskap eller forvaltning av datasettet, dersom dette har betydning for autentisitet, integritet og fortolkning.",
    frequency:
      "Hvor ofte datasettet har nytt innhold. Verdien velges fra EU’s kontrollerte vokabular [frequency](https://op.europa.eu/en/web/eu-vocabularies/concept-scheme/-/resource?uri=http://publications.europa.eu/resource/authority/frequency)",
    modified: "Dato for siste oppdatering av datasettet.",
    currentness: "Avvik eller tilleggsopplysninger om oppdateringsfrekvens.",
    completeness:
      "Dersom datasettet ikke innholder alle objekter som nevnt i formålet, bør det oppgis her.",
    accuracy:
      "Dersom datasettets innhold ikke er i samsvar med formålet, bør det oppgis her.",
    availability:
      "Dersom datasettets tilgangsnivå har avvik eller tilleggsopplysninger, bør det oppgis her.",
    qualifiedAttributions:
      "En aktør som har en eller annen form for ansvar for datasettet, men som ikke er en utgiver eller produsent. Dette kan for eksempel være en distributør.",
    relevance:
      "Dersom det er bruksområder datasettet er spesielt egnet for eller ikke egnet for, bør det oppgis her.",
    conformsTo:
      "Lenke til en standard, spesifikasjon eller et etablert skjema som datasettet er i samsvar med.",
    references:
      'Oppgi hvilken kobling dette datasettet har til et annet datasett. For eksempel: dersom dette datasettet er et utdrag av et større datasett, oppgir du relasjonen "er en del av" og datasettet det er et utdrag fra.',
    inSeries: "Velg en datasettserie som dette datasettet er en del av.",
    relatedResources: "En beslektet ressurs, uten spesifisert relasjonstype.",
    informationModelsFromFDK: "Informasjonsmodell fra data.norge.no.",
    informationModelsFromOtherSources:
      "Informasjonsmodell fra et annet sted enn data.norge.no.",
    contactName:
      "Navnet på kontaktpunktet. Typisk en organisasjon eller enhet.",
    contactFields:
      "Kontaktinformasjon for kontaktpunktet. Minst ett av feltene må fylles ut.",
    statusSwitch:
      "Toggelen bestemmer om datasettbeskrivelsen blir lagret med status “Godkjent” eller som et “Utkast”. For å endre status til “Godkjent” må alle obligatoriske felter være fylt ut. Husk å lagre skjemaet for å oppdatere status. For å kunne fjerne godkjent-status må et publisert datasett først avpubliseres.",
    keywords:
      "Brukes gjerne dersom et sentralt begrep ikke finnes i begrepskatalogen.",
    concepts:
      "Velg begrep registrert i [https://data.norge.no/concepts](begrepskatalogen til data.norge). Ved å henvise til gjennomarbeidede beskrivelser som virksomheten selv er ansvarlig for å vedlikeholde, sikrer vi at det er tydelig hvordan et begrep brukt i datasettet skal forstås og at denne forståelsen er riktig og oppdatert.",
    publishWarning:
      'Datasettbeskrivelsen må ha status "Godkjent" for å kunne publiseres til Data.norge.no. Statusen kan endres i ',
    publish:
      "Publiser datasettbeskrivelsen til Data.norge.no. En beskrivelse kan ikke slettes så lenge den er publisert.",
    mobilityTheme:
      "Velg ett eller flere mobility-tema som beskriver innholdet i datasettet. Listen er fra [EUs liste over mobility-tema](https://w3id.org/mobilitydcat-ap/mobility-theme).",
    distributionRights: "Betingelser for tilgang og bruk av distribusjonen.",
    mobilityDataStandard:
      "Standard for distribusjonen av datasettet. Velges fra [EUs kontrollerte vokabular for Mobility Data Standard](https://w3id.org/mobilitydcat-ap/mobility-data-standard).",
  },
  heading: {
    about: "Om datasettet",
    theme: "Hovedtema",
    distributions: "Distribusjon",
    details: "Detaljer",
    relations: "Relasjoner",
    concept: "Begrep og emneord",
    informationModels: "Informasjonsmodeller",
    contactPoint: "Kontaktpunkt",
  },
  subtitle: {
    about:
      "Sentral informasjon om datasettet. Informasjonen som legges inn her skal hjelpe andre med å finne datasettet og vurdere om det er relevant for dem.",
    theme:
      "Det eller de mest sentrale områdene innholdet i datasettet kan kategoriseres under. Tema kan hjelpe andre med å finne presise resultater i filtrerte søk.",
    distributions:
      "Informasjon som gjør det mulig for andre å ta i bruk selve datasettet. ",
    details:
      "Opplysninger som videre beskriver datasettet. Dette vil hjelpe datakonsumenter med å vurdere om datasettet er aktuelt for deres formål.",
    relations:
      "Andre datasett og ressurser som har relevante koblinger til dette datasettet.",
    concept:
      "Begrepsbeskrivelser gir felles og tydelige rammer for å forstå og tolke innholdet i datasettet.",
    informationModels: "Informasjonsmodeller som datasettet er i samsvar med.",
    contactPoint:
      "Informasjon om en organisasjon eller enhet som kan kontaktes for spørsmål eller kommentarer om datasettet. Dersom datakonsumenter har spørsmål knyttet til datasettet, er det hit de vil henvende seg.",
  },
  fieldLabel: {
    losTheme: "LOS-tema",
    euDataTheme: "Datatema",
    concepts: "Begreper",
    mediaType: "Medietyper",
    format: "Format",
    accessURL: "Tilgangslenke",
    downloadURL: "Nedlastingslenke",
    dataset: "Datasett",
    relationType: "Relasjonstype",
    datasetSeries: "Datasettserie",
    choseRelation: "Velg relasjon",
    conformsTo: "Standard",
    standard: "Standard",
    page: "Lenke til dokumentasjon",
    license: "Lisens",
    accessServices: "Tilgangstjeneste",
    legalBasisForRestriction: "Skjermingshjemmel",
    legalBasisForProcessing: "Behandlingsgrunnlag",
    legalBasisForAccess: "Utleveringshjemmel",
    legalBasis: "Juridisk grunnlag",
    keywords: "Nøkkelord",
    distribution: "Distribusjon",
    distributions: "Distribusjoner",
    issued: "Utgivelsesdato",
    language: "Språk",
    spatial: "Dekningsområde",
    temporal: "Tidsrom",
    lastUpdated: "Sist oppdatert",
    landingPage: "Landingsside",
    type: "Type",
    title: "Tittel",
    provenance: "Eierskapshistorikk",
    frequency: "Oppdateringsfrekvens",
    modified: "Sist oppdatert",
    currentness:
      "Aktualitet: Avvik eller tilleggsopplysninger om oppdateringsfrekvens",
    completeness: "Kompletthet",
    accuracy: "Nøyaktighet",
    availability: "Tilgjengelighet",
    qualifiedAttributions: "Annen ansvarlig aktør",
    relevance: "Relevans",
    references: "Relaterte datasett",
    inSeries: "Relasjon til datasettserie",
    relatedResources: "Relaterte ressurser",
    informationModelsFromFDK: "Informasjonsmodell fra Data.norge.no",
    informationModelsFromOtherSources: "Informasjonsmodell fra andre kilder",
    sample: "Eksempeldata",
    datasetID: "Datasett-ID",
    registrationStatus: "Registeringsstatus",
    ignoreRequired: "Ignorer påkrevde felt",
    contactName: "Navn",
    contactFields: "Kontaktinformasjon",
    description: "Beskrivelse",
    mobilityTheme: "Mobility-tema",
    distributionRights: "Rettigheter",
    mobilityDataStandard: "Mobility-standard",
  },
  alert: {
    confirmDelete: "Er du sikker på at du vil slette datasettbeskrivelsen?",
    formError: "Du har feil i skjemaet. Rett opp i disse før du kan lagre.",
    confirmUnpublish:
      "Er du sikker på at du vil avpublisere datasettbeskrivelsen?",
    confirmPublish:
      "Er du sikkert på at du vil publisere datasettbeskrivelsen?",
    youHaveUnsavedChanges:
      "Det finnes endringer som ikke har blitt lagret på datasettbeskrivelsen:",
    ignoreRequired:
      "I utgangspunktet er det krav om at alle påkrevde felt må fylles ut for å få lagret. Når avhukingsboksen er aktiv, må bare tittel være fylt ut.",
    unpublishBeforeUnapprove:
      "Datasettet må være avpublisert før status kan endres fra ‘Godkjent’. Avpublisering gjøres fra detaljsiden.",
    unpublishBeforeIgnoreRequired:
      "Datasettet må være avpublisert for å kunne aktivere ‘Ignorer påkrevde felt’. Avpublisering gjøres fra detaljsiden.",
  },
  validation: {
    title: "Tittelen må være minst 3 karakterer lang.",
    titleRequired: "Tittel er påkrevd.",
    descriptionRequired: "Beskrivelse er påkrevd.",
    description: "Beskrivelsen må være minst 5 karakterer lang.",
    url: `Ugyldig lenke. Vennligst sørg for at lenken starter med ‘https://’ og inneholder et gyldig toppdomene (f.eks. ‘.no’).`,
    euDataTheme: "Minst ett EU-tema må være valgt.",
    searchString: "Ingen treff. Søkestrengen må inneholde minst to bokstaver.",
    accessURL: "Tilgangslenke er påkrevd.",
    contactPoints: "Minst en verdi må fylles ut for kontaktpunktet.",
    contacPointName: "Navn på kontaktpunkt er obligatorisk",
    accessUrlRequired: "Tilgangslenke må fylles ut.",
    relation: "Begge verdiene må fylles ut for å legge til en relasjon.",
    mobilityTheme: "Minst ett mobility-tema må være valgt.",
    mobilityDataStandard: "Minst en datastandard må være valgt.",
    mobilityRights: "Rettigheter må velges.",
    format: "Minst ett filformat må velges.",
    distribution: "Distribusjon er påkrevd.",
    spatial: "Minst ett dekningsområde må velges.",
    frequency: "Oppdateringsfrekvens må velges.",
  },
  button: {
    addDate: "Legg til tidsperiode",
    addInformationModel: "Legg til informasjonsmodell",
    addStandard: "Legg til standard",
    addDistribution: "Legg til distribusjon",
    addSample: "Legg til eksempeldata",
    updateSamole: "Oppdater eksempeldata",
    updateDistribution: "Oppdater distribusjon",
    update: "Oppdater",
    addDataset: "Legg til datasett",
    addDatasetSeries: "Legg til datasettserie",
    addMobilitytDataset: "Legg til mobility-datasett",
  },
  datasetTypeModal: {
    title: "Legg til datasett",
    intro: "Vennligst velg hvilken type datasett du vil registrere:",
    selectButton: "Velg",
    standardDataset: {
      title: "Standard datasett",
      description: "Bruker DCAT-AP-NO-spesifikasjonen",
      button: "Standard datasett",
    },
    mobilityDataset: {
      title: "Datasett for mobilitet og transport",
      description: "Bruker MobilityDCAT-AP-spesifikasjonen",
      button: "Datasett for mobilitet og transport",
    },
  },
  errors: {
    qualifiedAttributions: "Kunne ikke hente enheter.",
  },
  filter: {
    DRAFT: "Utkast",
    PUBLISH: "Publisert",
    APPROVE: "Godkjent",
  },
  unapproveModal: {
    title: "Datasettet er godkjent",
    message:
      "Kan ikke ignorere påkrevde felt for godkjente datasett. Skal godkjenningen også fjernes?",
  },
};
